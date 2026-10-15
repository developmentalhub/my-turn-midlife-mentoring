import Link from "next/link";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type LocalBusiness = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  suburb: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  one_sentence: string;
  inspiration: string;
  love_about_business: string;
  sprinkle_my_turn: string;
  gentle_invitation: string;
  image_url: string | null;
  status: string;
  created_at: string;
};

const ideas = [
  {
    title: "A café",
    text: "Create a little invitation for women to sit, stay a while and enjoy their coffee without rushing off to the next thing.",
  },
  {
    title: "A florist",
    text: "Remind women that they don't need a special occasion or another person to buy themselves flowers.",
  },
  {
    title: "A bookshop",
    text: "Create a shelf of books chosen simply because they are beautiful, interesting, funny or impossible to put down.",
  },
  {
    title: "A creative business",
    text: "Give women permission to be beginners, make something badly and enjoy the process without needing it to become productive.",
  },
];

function normaliseUrl(
  value?: string | null
) {
  if (!value) {
    return null;
  }

  const cleanValue =
    value.trim();

  if (!cleanValue) {
    return null;
  }

  if (
    cleanValue.startsWith(
      "http://"
    ) ||
    cleanValue.startsWith(
      "https://"
    )
  ) {
    return cleanValue;
  }

  return `https://${cleanValue}`;
}

export default async function MyTurnLocalPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "my_turn_local_applications"
    )
    .select(
      `
        id,
        business_name,
        contact_name,
        email,
        phone,
        suburb,
        website,
        instagram,
        facebook,
        one_sentence,
        inspiration,
        love_about_business,
        sprinkle_my_turn,
        gentle_invitation,
        image_url,
        status,
        created_at
      `
    )
    .eq(
      "status",
      "approved"
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "My Turn Local approved business load error:",
      error
    );
  }

  const approvedBusinesses =
    (data ?? []) as LocalBusiness[];

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="absolute inset-0">
          <img
            src="/my-turn-local/my-turn-local-hero.png"
            alt=""
            className="h-full w-full object-cover object-center opacity-95"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#dfeef4]/95 via-[#dfeef4]/80 to-[#dfeef4]/25" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#557f91]">
              My Turn Local
            </p>

            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-[#24373d] md:text-7xl lg:text-[82px]">
              Discover somewhere
              <br />
              that might make life
              <br />
              feel a little more
              <br />
              like yours again.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#526b75] md:text-xl md:leading-9">
              Meet the people behind
              local businesses, hear
              why they love what they
              do, and discover little
              invitations to try
              something, make
              something, go somewhere
              or simply make a little
              room for yourself.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#businesses"
                className="inline-flex items-center justify-center rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
              >
                Explore My Turn Local
              </a>

              <Link
                href="/my-turn/local/apply"
                className="inline-flex items-center justify-center rounded-full bg-white/80 px-7 py-4 text-sm font-semibold text-[#456570] ring-1 ring-white transition hover:bg-white"
              >
                Add your business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#fffdf8] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <img
              src="/my-turn-local/my-turn-local-business-feature.png"
              alt="Watercolour illustration representing local businesses and community"
              className="w-full rounded-[34px]"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
              More than a directory
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
              Meet the people
              <br />
              behind local business.
            </h2>

            <div className="mt-7 space-y-5 text-lg leading-8 text-[#5b737c]">
              <p>
                We don&apos;t just
                want to tell you where
                to buy something. We
                want you to meet the
                people behind the
                places in our
                community.
              </p>

              <p>
                Every business in My
                Turn Local is invited
                to tell us what
                inspired them, what
                they still genuinely
                love about their work
                and how they can help
                women make a little
                more room for
                themselves.
              </p>

              <p className="font-serif text-2xl italic leading-9 text-[#405e68]">
                Because sometimes
                discovering a new
                place can also mean
                rediscovering a little
                part of yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="bg-[#fffdf8] px-6">
        <img
          src="/my-turn-local/my-turn-local-divider.png"
          alt=""
          className="mx-auto max-h-28 w-full max-w-5xl object-contain"
        />
      </div>

      {/* FEATURED BUSINESS */}
      <section
        id="businesses"
        className="bg-[#fffdf8] px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
              Meet a My Turn Local
              business
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#24373d] md:text-6xl">
              Never Too Old to Play
            </h2>

            <p className="mt-4 text-base font-medium text-[#71868d]">
              Chirnside Park,
              Victoria
            </p>
          </div>

          <div className="overflow-hidden rounded-[40px] bg-[#eef6f7] shadow-sm ring-1 ring-white">
            <div className="grid lg:grid-cols-2">
              <div className="min-h-[390px]">
                <img
                  src="/my-turn-local/never-too-old-to-play-chirnside-park.png"
                  alt="Watercolour illustration of Never Too Old to Play in Chirnside Park"
                  className="h-full min-h-[390px] w-full object-cover"
                />
              </div>

              <div className="flex items-center p-8 md:p-12 lg:p-14">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7196a3]">
                    Allied health
                    movement space
                  </p>

                  <h3 className="mt-4 font-serif text-4xl leading-tight text-[#29434d]">
                    Movement without
                    the mirrors,
                    pressure or
                    judgment.
                  </h3>

                  <p className="mt-6 text-lg leading-8 text-[#5c747d]">
                    Never Too Old to
                    Play is a
                    welcoming allied
                    health movement
                    space where women
                    can work towards
                    their health goals
                    with the support
                    of an Exercise
                    Physiologist,
                    while enjoying
                    fun, playful
                    activities in a
                    calm and
                    non-judgmental
                    environment.
                  </p>

                  <div className="mt-8 rounded-[24px] bg-white/70 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                      Find us
                    </p>

                    <p className="mt-3 leading-7 text-[#526b75]">
                      7 Meadowgate
                      Drive
                      <br />
                      Chirnside Park,
                      Victoria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BUSINESS STORY */}
            <div className="grid gap-8 border-t border-white/80 p-8 md:p-12 lg:grid-cols-2 lg:p-14">
              <div className="rounded-[28px] bg-white/70 p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                  Why I created it
                </p>

                <p className="mt-5 font-serif text-2xl leading-9 text-[#314c57]">
                  “I created Never Too
                  Old to Play because
                  so many women,
                  myself included,
                  felt nervous or out
                  of place in a
                  traditional gym
                  environment.”
                </p>

                <p className="mt-5 leading-7 text-[#617981]">
                  I wanted to build a
                  space where women
                  could move their
                  bodies, improve
                  their health and
                  feel good doing it,
                  without mirrors,
                  pressure or
                  judgment.
                </p>
              </div>

              <div className="rounded-[28px] bg-white/70 p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                  What I still
                  genuinely love
                </p>

                <p className="mt-5 leading-8 text-[#617981]">
                  I love how play and
                  movement can
                  completely change
                  the way we feel in
                  our bodies and
                  nervous systems.
                  There is something
                  powerful about
                  laughing, being a
                  little silly, and
                  still knowing you
                  are doing something
                  meaningful for your
                  health.
                </p>

                <p className="mt-4 leading-8 text-[#617981]">
                  I love that women
                  of all shapes,
                  sizes and abilities
                  can come here. It
                  feels like
                  community first,
                  with physical
                  health growing
                  naturally through
                  the fun, connection
                  and consistency we
                  build together.
                </p>
              </div>
            </div>

            {/* SECONDARY IMAGE */}
            <div className="grid gap-0 border-t border-white/80 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-8 md:p-12 lg:p-14">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                  A little My Turn
                </p>

                <h3 className="mt-4 font-serif text-4xl leading-tight text-[#29434d]">
                  Making women feel
                  visible, supported
                  and confident in
                  their bodies.
                </h3>

                <p className="mt-6 text-lg leading-8 text-[#5c747d]">
                  Never Too Old to
                  Play gives women
                  permission to take
                  up space and do
                  something for
                  themselves without
                  guilt. It is
                  somewhere women can
                  feel cared for and
                  encouraged while
                  rebuilding
                  confidence in their
                  bodies in a way
                  that feels playful,
                  safe and kind.
                </p>

                <div className="mt-8 rounded-[28px] bg-[#dfeef4] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#557f91]">
                    An invitation
                    from Robyn
                  </p>

                  <p className="mt-4 font-serif text-2xl italic leading-9 text-[#314c57]">
                    Come and play
                    with us. You
                    don&apos;t need
                    to be fit,
                    confident or
                    know what
                    you&apos;re
                    doing. Just come
                    as you are, and
                    give yourself
                    the chance to
                    reconnect with a
                    part of you that
                    may have been
                    waiting a very
                    long time.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="https://www.nevertoooldtoplay.com"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#284f5d] px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    Visit website
                  </a>

                  <a
                    href="https://www.instagram.com/nevertoooldtoplay/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#527581] ring-1 ring-[#d9e5e8]"
                  >
                    Instagram
                  </a>

                  <a
                    href="https://www.facebook.com/nevertoooldtoplaychirnsidepark"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#527581] ring-1 ring-[#d9e5e8]"
                  >
                    Facebook
                  </a>
                </div>
              </div>

              <div className="min-h-[420px]">
                <img
                  src="/my-turn-local/never-too-old-to-play-chirnside-park-seniors.png"
                  alt="Watercolour illustration of playful movement at Never Too Old to Play"
                  className="h-full min-h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROVED LOCAL BUSINESSES */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
              A growing local
              collection
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
              Who will we discover
              next?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#586f78]">
              Discover local people,
              places and businesses
              that give women another
              reason to get out, try
              something, connect or
              do something simply
              because they want to.
            </p>
          </div>

          {approvedBusinesses.length >
          0 ? (
            <div className="mt-14 grid gap-7 lg:grid-cols-2">
              {approvedBusinesses.map(
                (
                  business
                ) => {
                  const website =
                    normaliseUrl(
                      business.website
                    );

                  const instagram =
                    normaliseUrl(
                      business.instagram
                    );

                  const facebook =
                    normaliseUrl(
                      business.facebook
                    );

                  return (
                    <article
                      key={
                        business.id
                      }
                      className="overflow-hidden rounded-[34px] bg-[#fffdf8] shadow-sm ring-1 ring-white"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-[#eaf3f5]">
                        <img
                          src={
                            business.image_url ||
                            "/my-turn-local/my-turn-local-business-placeholder.png"
                          }
                          alt={
                            business.business_name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-7 md:p-9">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b969f]">
                              {
                                business.suburb
                              }
                            </p>

                            <h3 className="mt-2 font-serif text-3xl leading-tight text-[#29434d] md:text-4xl">
                              {
                                business.business_name
                              }
                            </h3>
                          </div>

                          <span className="rounded-full bg-[#edf5f7] px-4 py-2 text-xs font-semibold text-[#557581]">
                            My Turn
                            Local
                          </span>
                        </div>

                        <p className="mt-5 text-lg leading-8 text-[#526d76]">
                          {
                            business.one_sentence
                          }
                        </p>

                        <div className="mt-8 border-t border-[#e2eaec] pt-7">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                            Why they
                            started
                          </p>

                          <p className="mt-3 leading-7 text-[#617981]">
                            {
                              business.inspiration
                            }
                          </p>
                        </div>

                        <div className="mt-7 rounded-[26px] bg-[#edf5f7] p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#557f91]">
                            What they
                            still love
                          </p>

                          <p className="mt-3 leading-7 text-[#526d76]">
                            {
                              business.love_about_business
                            }
                          </p>
                        </div>

                        <div className="mt-7">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7196a3]">
                            How they
                            sprinkle
                            in a
                            little My
                            Turn
                          </p>

                          <p className="mt-3 leading-7 text-[#617981]">
                            {
                              business.sprinkle_my_turn
                            }
                          </p>
                        </div>

                        <div className="mt-7 rounded-[26px] bg-[#dfeef4] p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#557f91]">
                            Their
                            invitation
                            to you
                          </p>

                          <p className="mt-3 font-serif text-xl italic leading-8 text-[#314c57]">
                            “
                            {
                              business.gentle_invitation
                            }
                            ”
                          </p>
                        </div>

                        {(website ||
                          instagram ||
                          facebook) && (
                          <div className="mt-7 flex flex-wrap gap-3">
                            {website && (
                              <a
                                href={
                                  website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#284f5d] px-5 py-3 text-sm font-semibold text-white"
                              >
                                Visit
                                website
                              </a>
                            )}

                            {instagram && (
                              <a
                                href={
                                  instagram
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#edf5f7] px-5 py-3 text-sm font-semibold text-[#527581]"
                              >
                                Instagram
                              </a>
                            )}

                            {facebook && (
                              <a
                                href={
                                  facebook
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#edf5f7] px-5 py-3 text-sm font-semibold text-[#527581]"
                              >
                                Facebook
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <article
                    key={
                      item
                    }
                    className="overflow-hidden rounded-[30px] bg-[#fffdf8] shadow-sm ring-1 ring-white"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src="/my-turn-local/my-turn-local-business-placeholder.png"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b969f]">
                        Your
                        business
                        could be
                        here
                      </p>

                      <h3 className="mt-3 font-serif text-2xl text-[#314c57]">
                        Share more
                        than what
                        you sell.
                      </h3>

                      <p className="mt-4 leading-7 text-[#667e86]">
                        Tell women
                        why you
                        care about
                        what you
                        do and
                        invite them
                        to
                        experience
                        something
                        that might
                        make their
                        week a
                        little
                        better.
                      </p>

                      <Link
                        href="/my-turn/local/apply"
                        className="mt-6 inline-flex text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
                      >
                        Apply to
                        join
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* SPRINKLE MY TURN */}
      <section className="bg-[#fffdf8] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <img
              src="/my-turn-local/my-turn-local-sprinkle.png"
              alt="Watercolour illustration of a woman enjoying a quiet moment"
              className="w-full rounded-[34px]"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
              For local businesses
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
              Sprinkle a little
              <br />
              My Turn into what
              <br />
              you already do.
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#586f78]">
              You don&apos;t need to
              completely change your
              business to be part of
              My Turn. We&apos;ll
              help you find one
              simple way to encourage
              women to pause, play,
              connect, try something
              new or choose something
              just for themselves.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ideas.map(
            (idea) => (
              <article
                key={
                  idea.title
                }
                className="rounded-[28px] bg-[#edf5f7] p-7"
              >
                <p className="font-serif text-2xl text-[#314c57]">
                  {
                    idea.title
                  }
                </p>

                <p className="mt-4 leading-7 text-[#617981]">
                  {
                    idea.text
                  }
                </p>
              </article>
            )
          )}
        </div>
      </section>

      {/* JOIN CTA */}
      <section
        id="join"
        className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32"
      >
        <div className="absolute inset-0">
          <img
            src="/my-turn-local/my-turn-local-cta.png"
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#dfeef4]/55" />
        </div>

        <img
          src="/my-turn-local/my-turn-local-corner-botanical.png"
          alt=""
          className="pointer-events-none absolute right-0 top-0 hidden w-[300px] opacity-75 md:block"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            Become part of My Turn
            Local
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
            There&apos;s a story
            behind your business.
            <br />
            We&apos;d love to hear
            it.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#526b75]">
            My Turn Local is for
            businesses that want to
            be part of something
            thoughtful, genuinely
            local and supportive of
            women.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#526b75]">
            We&apos;ll help tell
            your story and explore
            how a little My Turn
            could naturally fit into
            what you already do.
          </p>

          <div className="mt-10">
            <Link
              href="/my-turn/local/apply"
              className="inline-flex rounded-full bg-[#284f5d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
            >
              Apply to join My Turn
              Local
            </Link>
          </div>

          <p className="mt-5 text-sm text-[#748a92]">
            Applications are
            reviewed before they
            appear publicly.
          </p>
        </div>
      </section>

      {/* BACK TO MY TURN */}
      <section className="bg-[#fffdf8] px-6 py-12 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
        >
          ← Back to My Turn
        </Link>
      </section>

      <footer className="border-t border-white/50 px-6 py-8 text-center text-sm text-[#607982]">
        My Turn by Never Too Old to
        Play · Chirnside Park,
        Victoria
      </footer>
    </main>
  );
}