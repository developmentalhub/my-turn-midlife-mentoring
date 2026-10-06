"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../../../lib/supabase";

type Idea = {
  id: number;
  text: string;
  isSeed?: boolean;
};

type Commitment = {
  id: string;
  firstName: string;
  text: string;
  createdAt?: string;
};

const starterIdeas: Idea[] = [
  {
    id: 1,
    text: "Read in the middle of the day.",
    isSeed: true,
  },
  {
    id: 2,
    text: "Go somewhere for no reason.",
    isSeed: true,
  },
  {
    id: 3,
    text: "Make something badly.",
    isSeed: true,
  },
  {
    id: 4,
    text: "Dance in the kitchen.",
    isSeed: true,
  },
  {
    id: 5,
    text: "Try a hobby you might quit.",
    isSeed: true,
  },
  {
    id: 6,
    text: "Sit in the sun without multitasking.",
    isSeed: true,
  },
  {
    id: 7,
    text: "Call someone just to chat.",
    isSeed: true,
  },
  {
    id: 8,
    text: "Wear something fun.",
    isSeed: true,
  },
  {
    id: 9,
    text: "Go to a market alone.",
    isSeed: true,
  },
  {
    id: 10,
    text: "Play a game.",
    isSeed: true,
  },
  {
    id: 11,
    text: "Get your hands dirty.",
    isSeed: true,
  },
  {
    id: 12,
    text: "Be a beginner.",
    isSeed: true,
  },
  {
    id: 13,
    text: "Laugh loudly.",
    isSeed: true,
  },
  {
    id: 14,
    text: "Do something that achieves absolutely nothing.",
    isSeed: true,
  },
  {
    id: 15,
    text: "Buy the ridiculous craft kit.",
    isSeed: true,
  },
  {
    id: 16,
    text: "Go outside in the rain.",
    isSeed: true,
  },
  {
    id: 17,
    text: "Take the long way home.",
    isSeed: true,
  },
  {
    id: 18,
    text: "Listen to an old favourite album from start to finish.",
    isSeed: true,
  },
];

export default function MyTurnListPage() {
  const [ideas, setIdeas] =
    useState<Idea[]>(starterIdeas);

  const [myList, setMyList] =
    useState<Idea[]>([]);

  const [newIdea, setNewIdea] =
    useState("");

  const [commitments, setCommitments] =
    useState<Commitment[]>([]);

  const [firstName, setFirstName] =
    useState("");

  const [commitment, setCommitment] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    commitmentsLoading,
    setCommitmentsLoading,
  ] = useState(true);

  const [
    commitmentSubmitting,
    setCommitmentSubmitting,
  ] = useState(false);

  function loadMyList() {
    try {
      const savedList =
        window.localStorage.getItem(
          "my-turn-personal-list"
        );

      if (!savedList) {
        setMyList([]);
        return;
      }

      const parsedList =
        JSON.parse(savedList);

      if (Array.isArray(parsedList)) {
        setMyList(parsedList);
      }
    } catch {
      setMyList([]);
    }
  }

  async function loadCommitments() {
    setCommitmentsLoading(true);

    const { data, error } =
      await supabase
        .from("my_turn_commitments")
        .select(
          "id, first_name, commitment, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Commitment wall load error:",
        error
      );

      setCommitmentsLoading(false);
      return;
    }

    const sharedCommitments: Commitment[] =
      (data ?? []).map((item) => ({
        id: item.id,
        firstName:
          item.first_name,
        text:
          item.commitment,
        createdAt:
          item.created_at,
      }));

    setCommitments(
      sharedCommitments
    );

    setCommitmentsLoading(false);
  }

  useEffect(() => {
    try {
      const savedIdeas =
        window.localStorage.getItem(
          "my-turn-shared-ideas"
        );

      if (savedIdeas) {
        const parsedIdeas =
          JSON.parse(savedIdeas);

        if (
          Array.isArray(parsedIdeas)
        ) {
          setIdeas([
            ...parsedIdeas,
            ...starterIdeas,
          ]);
        }
      }

      loadMyList();
    } catch {
      // The personal list can still work
      // even if browser storage is unavailable.
    }

    loadCommitments();

    function handleListUpdate() {
      loadMyList();
    }

    window.addEventListener(
      "my-turn-list-updated",
      handleListUpdate
    );

    window.addEventListener(
      "storage",
      handleListUpdate
    );

    return () => {
      window.removeEventListener(
        "my-turn-list-updated",
        handleListUpdate
      );

      window.removeEventListener(
        "storage",
        handleListUpdate
      );
    };
  }, []);

  const myListIds = useMemo(
    () =>
      new Set(
        myList.map(
          (item) => item.id
        )
      ),
    [myList]
  );

  function toggleMyList(
    idea: Idea
  ) {
    let updated: Idea[];

    if (
      myListIds.has(idea.id)
    ) {
      updated =
        myList.filter(
          (item) =>
            item.id !== idea.id
        );
    } else {
      updated = [
        idea,
        ...myList,
      ];
    }

    setMyList(updated);

    try {
      window.localStorage.setItem(
        "my-turn-personal-list",
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event(
          "my-turn-list-updated"
        )
      );
    } catch {
      // Ignore storage errors.
    }
  }

  function addIdea(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanIdea =
      newIdea.trim();

    if (!cleanIdea) {
      setMessage(
        "Add an idea first."
      );
      return;
    }

    const idea: Idea = {
      id: Date.now(),
      text: cleanIdea,
    };

    const personalIdeas =
      ideas.filter(
        (item) =>
          !item.isSeed
      );

    const updatedPersonalIdeas = [
      idea,
      ...personalIdeas,
    ];

    setIdeas([
      idea,
      ...ideas,
    ]);

    setNewIdea("");

    setMessage(
      "Your idea has been added."
    );

    try {
      window.localStorage.setItem(
        "my-turn-shared-ideas",
        JSON.stringify(
          updatedPersonalIdeas
        )
      );
    } catch {
      // Ignore storage errors.
    }
  }

    async function addCommitment(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanName =
      firstName.trim();

    const cleanCommitment =
      commitment.trim();

    if (
      !cleanName ||
      !cleanCommitment
    ) {
      setMessage(
        "Add your first name and what you plan to do."
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
      cleanCommitment.length > 500
    ) {
      setMessage(
        "Please keep your commitment under 500 characters."
      );
      return;
    }

    setCommitmentSubmitting(
      true
    );

    setMessage("");

    try {
      const response =
        await fetch(
          "/api/commitment",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              firstName:
                cleanName,
              commitment:
                cleanCommitment,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong while adding your commitment. Please try again."
        );

        return;
      }

      const newCommitment =
        result.commitment as Commitment;

      setCommitments(
        (current) => [
          newCommitment,
          ...current,
        ]
      );

      setFirstName("");
      setCommitment("");

      setMessage(
        "Your commitment has been added to the shared wall."
      );
    } catch (error) {
      console.error(
        "Commitment save error:",
        error
      );

      setMessage(
        "Something went wrong while adding your commitment. Please try again."
      );
    } finally {
      setCommitmentSubmitting(
        false
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      {/* HERO */}
      <section className="px-6 pb-14 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            My Turn List
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-[#24373d] md:text-7xl">
            Things we forgot
            we&apos;re allowed to do.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#526b75]">
            Save the ones that make
            you smile. Add your own.
            Borrow inspiration from
            someone else.
          </p>
        </div>
      </section>

      {/* IDEAS */}
      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {ideas.map(
              (idea) => {
                const selected =
                  myListIds.has(
                    idea.id
                  );

                return (
                  <article
                    key={idea.id}
                    className={[
                      "flex min-h-[190px] flex-col rounded-[28px] p-6 shadow-sm ring-1 transition",
                      selected
                        ? "bg-[#e9f3f5] ring-[#b5d0d8]"
                        : "bg-[#fffdf8] ring-white",
                    ].join(
                      " "
                    )}
                  >
                    <p className="font-serif text-2xl leading-8 text-[#314c57]">
                      {idea.text}
                    </p>

                    <div className="mt-auto pt-7">
                      <button
                        type="button"
                        onClick={() =>
                          toggleMyList(
                            idea
                          )
                        }
                        className={[
                          "rounded-full px-5 py-3 text-sm font-semibold transition",
                          selected
                            ? "bg-[#284f5d] text-white"
                            : "bg-[#edf5f7] text-[#527581] hover:bg-[#e4f0f2]",
                        ].join(
                          " "
                        )}
                      >
                        {selected
                          ? "✓ On my list"
                          : "Add to my list"}
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ADD IDEA */}
      <section className="bg-white/30 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[34px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7196a3]">
              Add yours
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#29434d]">
              What do you think we
              forgot we&apos;re
              allowed to do?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#617981]">
              Add something you want
              to remember for yourself.
            </p>

            <form
              onSubmit={addIdea}
              className="mt-7"
            >
              <textarea
                value={newIdea}
                onChange={(event) =>
                  setNewIdea(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="We’re allowed to..."
                className="w-full resize-none rounded-[22px] border border-[#d9e3e6] bg-white px-4 py-4 text-base leading-7 text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"
              />

              <button
                type="submit"
                className="mt-4 rounded-full bg-[#284f5d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
              >
                Add my idea
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SHARED COMMITMENT WALL */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
              This week
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
              I&apos;m making room
              for...
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#526b75]">
              No streaks. No pressure.
              Just one thing you want
              to make room for this
              week.
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#748a92]">
              This part is shared with
              the My Turn community, so
              other women can see what
              you&apos;re making room
              for too.
            </p>
          </div>

          <form
            onSubmit={
              addCommitment
            }
            className="mx-auto mt-10 max-w-3xl rounded-[34px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-[0.35fr_0.65fr]">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-[#405f69]"
                >
                  First name
                </label>

                <input
                  id="firstName"
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
                  htmlFor="commitment"
                  className="text-sm font-semibold text-[#405f69]"
                >
                  This week I&apos;m
                  going to...
                </label>

                <input
                  id="commitment"
                  value={commitment}
                  maxLength={500}
                  onChange={(
                    event
                  ) =>
                    setCommitment(
                      event.target
                        .value
                    )
                  }
                  placeholder="Take myself to the beach with a book..."
                  className="mt-2 w-full rounded-[20px] border border-[#d9e3e6] bg-white px-4 py-4 text-base text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                commitmentSubmitting
              }
              className="mt-5 w-full rounded-full bg-[#284f5d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {commitmentSubmitting
                ? "Adding yours..."
                : "Add mine to the shared wall"}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-[#557581]">
                {message}
              </p>
            )}
          </form>

          {commitmentsLoading ? (
            <div className="mt-12 rounded-[28px] bg-white/45 p-8 text-center">
              <p className="font-serif text-2xl text-[#314c57]">
                Seeing what everyone
                is making room for...
              </p>
            </div>
          ) : commitments.length >
            0 ? (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {commitments.map(
                (item) => (
                  <article
                    key={
                      item.id
                    }
                    className="rounded-[28px] bg-white/75 p-6 shadow-sm ring-1 ring-white"
                  >
                    <p className="font-serif text-2xl leading-8 text-[#314c57]">
                      “{item.text}”
                    </p>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#7d949b]">
                      {
                        item.firstName
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] bg-white/45 p-8 text-center">
              <p className="font-serif text-2xl text-[#314c57]">
                No commitments yet.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#687f88]">
                Maybe yours can be the
                first.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white/30 px-6 py-20 text-center md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="font-serif text-3xl leading-tight text-[#29434d] md:text-4xl">
            Maybe one little thing is
            enough.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#607982]">
            Your list doesn&apos;t
            have to become another
            to-do list. It&apos;s
            simply somewhere to
            collect the things that
            make you think, “That
            sounds like me.”
          </p>
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