"use client";



import {

  FormEvent,

  useEffect,

  useMemo,

  useState,

} from "react";

import Link from "next/link";

import { supabase } from "../../../lib/supabase";



type Reply = {

  id: string;

  postId: string;

  firstName: string;

  body: string;

  createdAt: string;

};



type Post = {

  id: string;

  firstName: string;

  body: string;

  createdAt: string;

  replies: Reply[];

};



function formatDate(dateString: string) {

  const date = new Date(dateString);



  return new Intl.DateTimeFormat(

    "en-AU",

    {

      day: "numeric",

      month: "short",

    }

  ).format(date);

}



export default function CommunityPage() {

  const [posts, setPosts] =

    useState<Post[]>([]);



  const [firstName, setFirstName] =

    useState("");



  const [body, setBody] =

    useState("");



  const [

    activeReplyPostId,

    setActiveReplyPostId,

  ] = useState<string | null>(

    null

  );



  const [

    replyName,

    setReplyName,

  ] = useState("");



  const [

    replyBody,

    setReplyBody,

  ] = useState("");



  const [message, setMessage] =

    useState("");



  const [loading, setLoading] =

    useState(true);



  const [

    submittingPost,

    setSubmittingPost,

  ] = useState(false);



  const [

    submittingReply,

    setSubmittingReply,

  ] = useState(false);



  async function loadCommunity() {

    setLoading(true);



    const {

      data: postsData,

      error: postsError,

    } = await supabase

      .from(

        "my_turn_community_posts"

      )

      .select(

        "id, first_name, body, created_at"

      )

      .order("created_at", {

        ascending: false,

      });



    if (postsError) {

      console.error(

        "Community posts load error:",

        postsError

      );



      setMessage(

        "We couldn't load the community right now."

      );



      setLoading(false);



      return;

    }



    const {

      data: repliesData,

      error: repliesError,

    } = await supabase

      .from(

        "my_turn_community_replies"

      )

      .select(

        "id, post_id, first_name, body, created_at"

      )

      .order("created_at", {

        ascending: true,

      });



    if (repliesError) {

      console.error(

        "Community replies load error:",

        repliesError

      );

    }



    const replies: Reply[] =

      (repliesData ?? []).map(

        (reply) => ({

          id: reply.id,

          postId:

            reply.post_id,

          firstName:

            reply.first_name,

          body:

            reply.body,

          createdAt:

            reply.created_at,

        })

      );



    const mappedPosts: Post[] =

      (postsData ?? []).map(

        (post) => ({

          id: post.id,

          firstName:

            post.first_name,

          body:

            post.body,

          createdAt:

            post.created_at,

          replies:

            replies.filter(

              (reply) =>

                reply.postId ===

                post.id

            ),

        })

      );



    setPosts(mappedPosts);

    setLoading(false);

  }



  useEffect(() => {

    loadCommunity();

  }, []);



  const replyCount =

    useMemo(

      () =>

        posts.reduce(

          (

            total,

            post

          ) =>

            total +

            post.replies.length,

          0

        ),

      [posts]

    );



  async function addPost(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanName =
      firstName.trim();

    const cleanBody =
      body.trim();

    if (
      !cleanName ||
      !cleanBody
    ) {
      setMessage(
        "Add your first name and something you'd like to share."
      );
      return;
    }

    if (
      cleanName.length > 50
    ) {
      setMessage(
        "Please keep your first name under 50 characters."
      );
      return;
    }

    if (
      cleanBody.length > 1500
    ) {
      setMessage(
        "Please keep your post under 1500 characters."
      );
      return;
    }

    setSubmittingPost(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/community-post",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            firstName:
              cleanName,
            body:
              cleanBody,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong while sharing your post. Please try again."
        );
        return;
      }

      const newPost =
        result.post as Post;

      setPosts(
        (current) => [
          newPost,
          ...current,
        ]
      );

      setBody("");

      setMessage(
        "Your post has been shared."
      );
    } catch (error) {
      console.error(
        "Community post save error:",
        error
      );

      setMessage(
        "Something went wrong while sharing your post. Please try again."
      );
    } finally {
      setSubmittingPost(false);
    }
  }

  async function addReply(
    event: FormEvent,
    postId: string
  ) {
    event.preventDefault();

    const cleanName =
      replyName.trim();

    const cleanBody =
      replyBody.trim();

    if (
      !cleanName ||
      !cleanBody
    ) {
      setMessage(
        "Add your first name and your reply."
      );
      return;
    }

    if (
      cleanName.length > 50
    ) {
      setMessage(
        "Please keep your first name under 50 characters."
      );
      return;
    }

    if (
      cleanBody.length > 750
    ) {
      setMessage(
        "Please keep your reply under 750 characters."
      );
      return;
    }

    setSubmittingReply(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/community-reply",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            postId,
            firstName:
              cleanName,
            body:
              cleanBody,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong while adding your reply. Please try again."
        );
        return;
      }

      const newReply =
        result.reply as Reply;

      setPosts(
        (current) =>
          current.map(
            (post) =>
              post.id ===
              postId
                ? {
                    ...post,
                    replies: [
                      ...post.replies,
                      newReply,
                    ],
                  }
                : post
          )
      );

      setReplyName("");
      setReplyBody("");
      setActiveReplyPostId(
        null
      );

      setMessage(
        "Your reply has been added."
      );
    } catch (error) {
      console.error(
        "Community reply save error:",
        error
      );

      setMessage(
        "Something went wrong while adding your reply. Please try again."
      );
    } finally {
      setSubmittingReply(false);
    }
  }

  return (

    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">

            {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-14 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            My Turn Community
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-[#24373d] md:text-7xl">
            Pull up a chair.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-xl font-medium leading-8 text-[#405d68]">
            This is where My Turn keeps going between our monthly catch-ups.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#526b75]">
            Share something you&apos;ve been thinking about, ask a question,
            tell us about something you tried, celebrate a small win,
            suggest something we could do together, or simply have a read
            and see what other women are thinking about too.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6a8088]">
            No need to have something clever to say. You can join in as much
            or as little as you like.
          </p>
        </div>
      </section>


      {/* WHAT THIS SPACE IS */}

      <section className="px-6 pb-14 md:px-10">

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">

          <div className="rounded-[28px] bg-white/70 p-6 shadow-sm ring-1 ring-white">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7896a0]">

              Ask

            </p>



            <p className="mt-3 font-serif text-2xl leading-8 text-[#314c57]">

              “Has anyone else ever

              wanted to try this?”

            </p>

          </div>



          <div className="rounded-[28px] bg-white/70 p-6 shadow-sm ring-1 ring-white">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7896a0]">

              Share

            </p>



            <p className="mt-3 font-serif text-2xl leading-8 text-[#314c57]">

              “I did something just

              for me today.”

            </p>

          </div>



          <div className="rounded-[28px] bg-white/70 p-6 shadow-sm ring-1 ring-white">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7896a0]">

              Connect

            </p>



            <p className="mt-3 font-serif text-2xl leading-8 text-[#314c57]">

              “Me too.”

            </p>

          </div>

        </div>

      </section>



      {/* NEW POST */}

      <section className="bg-white/30 px-6 py-16 md:px-10 md:py-20">

        <div className="mx-auto max-w-4xl">

          <form

            onSubmit={addPost}

            className="rounded-[36px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-10"

          >

            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7196a3]">

              Check in

            </p>



            <h2 className="mt-3 font-serif text-4xl text-[#29434d]">

              What&apos;s on your mind

              today?

            </h2>



            <p className="mt-4 max-w-2xl leading-7 text-[#617981]">

              It can be a thought,

              question, tiny win, idea,

              invitation, or something

              that made you laugh.

            </p>



            <div className="mt-7 grid gap-5 md:grid-cols-[0.3fr_0.7fr]">

              <div>

                <label

                  htmlFor="communityName"

                  className="text-sm font-semibold text-[#405f69]"

                >

                  First name

                </label>



                <input

                  id="communityName"

                  value={firstName}

                  maxLength={50}

                  onChange={(

                    event

                  ) =>

                    setFirstName(

                      event.target

                        .value

                    )

                  }

                  placeholder="Your first name"

                  className="mt-2 w-full rounded-[20px] border border-[#d9e3e6] bg-white px-4 py-4 text-base text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"

                />

              </div>



              <div>

                <label

                  htmlFor="communityBody"

                  className="text-sm font-semibold text-[#405f69]"

                >

                  Share something

                </label>



                <textarea

                  id="communityBody"

                  value={body}

                  maxLength={1500}

                  rows={4}

                  onChange={(

                    event

                  ) =>

                    setBody(

                      event.target

                        .value

                    )

                  }

                  placeholder="I keep thinking about..."

                  className="mt-2 w-full resize-none rounded-[20px] border border-[#d9e3e6] bg-white px-4 py-4 text-base leading-7 text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"

                />

              </div>

            </div>



            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs leading-5 text-[#82969d]">

                Posts are shared with

                everyone using the My

                Turn community.

              </p>



              <button

                type="submit"

                disabled={

                  submittingPost

                }

                className="rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:cursor-not-allowed disabled:opacity-60"

              >

                {submittingPost

                  ? "Sharing..."

                  : "Share with the community"}

              </button>

            </div>



            {message && (

              <p className="mt-5 rounded-[18px] bg-[#edf5f7] px-4 py-3 text-sm text-[#557581]">

                {message}

              </p>

            )}

          </form>

        </div>

      </section>



      {/* COMMUNITY FEED */}

      <section className="px-6 py-20 md:px-10 md:py-28">

        <div className="mx-auto max-w-5xl">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#557f91]">

                Around the table

              </p>



              <h2 className="mt-3 font-serif text-4xl text-[#24373d] md:text-5xl">

                What women are

                talking about

              </h2>

            </div>



            {!loading && (

              <p className="text-sm text-[#758a92]">

                {posts.length}{" "}

                {posts.length === 1

                  ? "conversation"

                  : "conversations"}{" "}

                · {replyCount}{" "}

                {replyCount === 1

                  ? "reply"

                  : "replies"}

              </p>

            )}

          </div>



          {loading ? (

            <div className="mt-10 rounded-[30px] bg-white/50 p-10 text-center">

              <p className="font-serif text-2xl text-[#314c57]">

                Pulling up a chair...

              </p>

            </div>

          ) : posts.length ===

            0 ? (

            <div className="mt-10 rounded-[30px] bg-white/55 p-10 text-center">

              <p className="font-serif text-2xl text-[#314c57]">

                It&apos;s quiet in

                here so far.

              </p>



              <p className="mt-3 text-[#687f88]">

                Your post could start

                the first conversation.

              </p>

            </div>

          ) : (

            <div className="mt-10 space-y-6">

              {posts.map(

                (post) => (

                  <article

                    key={post.id}

                    className="rounded-[30px] bg-[#fffdf8] p-6 shadow-sm ring-1 ring-white md:p-8"

                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="font-semibold text-[#365965]">

                          {

                            post.firstName

                          }

                        </p>



                        <p className="mt-1 text-xs text-[#91a2a8]">

                          {formatDate(

                            post.createdAt

                          )}

                        </p>

                      </div>



                      <div className="rounded-full bg-[#edf5f7] px-3 py-1.5 text-xs font-medium text-[#63818a]">

                        My Turn

                      </div>

                    </div>



                    <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-[#405d68]">

                      {post.body}

                    </p>



                    {post.replies.length >

                      0 && (

                      <div className="mt-7 space-y-3 border-t border-[#e6ecee] pt-6">

                        {post.replies.map(

                          (

                            reply

                          ) => (

                            <div

                              key={

                                reply.id

                              }

                              className="rounded-[22px] bg-[#edf5f7] px-5 py-4"

                            >

                              <div className="flex items-center gap-2">

                                <p className="text-sm font-semibold text-[#466874]">

                                  {

                                    reply.firstName

                                  }

                                </p>



                                <span className="text-xs text-[#9aacb1]">

                                  ·

                                </span>



                                <p className="text-xs text-[#91a2a8]">

                                  {formatDate(

                                    reply.createdAt

                                  )}

                                </p>

                              </div>



                              <p className="mt-2 whitespace-pre-wrap leading-7 text-[#536d76]">

                                {

                                  reply.body

                                }

                              </p>

                            </div>

                          )

                        )}

                      </div>

                    )}



                    {activeReplyPostId ===

                    post.id ? (

                      <form

                        onSubmit={(

                          event

                        ) =>

                          addReply(

                            event,

                            post.id

                          )

                        }

                        className="mt-6 border-t border-[#e6ecee] pt-6"

                      >

                        <p className="text-sm font-semibold text-[#456570]">

                          Add a reply

                        </p>



                        <div className="mt-3 grid gap-3 md:grid-cols-[0.3fr_0.7fr]">

                          <input

                            value={

                              replyName

                            }

                            maxLength={

                              50

                            }

                            onChange={(

                              event

                            ) =>

                              setReplyName(

                                event

                                  .target

                                  .value

                              )

                            }

                            placeholder="First name"

                            className="rounded-[18px] border border-[#d9e3e6] bg-white px-4 py-3 text-sm text-[#314c57] outline-none focus:border-[#759ca9]"

                          />



                          <textarea

                            value={

                              replyBody

                            }

                            maxLength={

                              750

                            }

                            rows={3}

                            onChange={(

                              event

                            ) =>

                              setReplyBody(

                                event

                                  .target

                                  .value

                              )

                            }

                            placeholder="Write a reply..."

                            className="resize-none rounded-[18px] border border-[#d9e3e6] bg-white px-4 py-3 text-sm leading-6 text-[#314c57] outline-none focus:border-[#759ca9]"

                          />

                        </div>



                        <div className="mt-3 flex flex-wrap gap-2">

                          <button

                            type="submit"

                            disabled={

                              submittingReply

                            }

                            className="rounded-full bg-[#284f5d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:opacity-60"

                          >

                            {submittingReply

                              ? "Replying..."

                              : "Add reply"}

                          </button>



                          <button

                            type="button"

                            onClick={() => {

                              setActiveReplyPostId(

                                null

                              );

                              setReplyName(

                                ""

                              );

                              setReplyBody(

                                ""

                              );

                            }}

                            className="rounded-full bg-[#edf5f7] px-5 py-3 text-sm font-semibold text-[#597984]"

                          >

                            Cancel

                          </button>

                        </div>

                      </form>

                    ) : (

                      <button

                        type="button"

                        onClick={() => {

                          setActiveReplyPostId(

                            post.id

                          );

                          setReplyName(

                            ""

                          );

                          setReplyBody(

                            ""

                          );

                          setMessage(

                            ""

                          );

                        }}

                        className="mt-6 rounded-full bg-[#edf5f7] px-5 py-3 text-sm font-semibold text-[#527581] transition hover:bg-[#e3eff2]"

                      >

                        Reply

                        {post.replies

                          .length >

                        0

                          ? ` (${post.replies.length})`

                          : ""}

                      </button>

                    )}

                  </article>

                )

              )}

            </div>

          )}

        </div>

      </section>



      {/* QUIETER OPTION */}

      <section className="bg-white/30 px-6 py-20 text-center md:px-10">

        <div className="mx-auto max-w-3xl">

          <p className="font-serif text-3xl leading-tight text-[#29434d] md:text-4xl">

            Don&apos;t feel like

            talking today?

          </p>



          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#607982]">

            That&apos;s okay too.

            My Turn has quieter spaces

            for days when you&apos;d

            rather reflect than

            contribute.

          </p>



          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link

              href="/my-turn/journal"

              className="rounded-full bg-[#24373d] px-6 py-3.5 text-sm font-semibold text-white"

            >

              Go to My Quiet Space

            </Link>



            <Link

              href="/my-turn/wall"

              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#527581] ring-1 ring-white"

            >

              Browse the Community Wall

            </Link>

          </div>

        </div>

      </section>



      <footer className="border-t border-white/50 px-6 py-8 text-center text-sm text-[#607982]">

        My Turn by Never Too Old to

        Play · Chirnside Park,

        Victoria

      </footer>

    </main>

  );

}