import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  adminCookieName,
  verifyAdminSessionToken,
} from "../../lib/adminAuth";

import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type Registration = {
  id: string;
  first_name: string;
  email: string;
  suburb: string | null;
  age_range: string | null;
  preferred_days: string[] | null;
  preferred_times: string[] | null;
  between_sessions: string[] | null;
  interests: string[] | null;
  bring_someone: string | null;
  childhood_play: string | null;
  miss_now: string | null;
  try_together: string | null;
  barrier: string | null;
  hope: string | null;
  created_at: string;
};

type CommunityPost = {
  id: string;
  first_name: string;
  body: string;
  created_at: string;
};

type CommunityReply = {
  id: string;
  post_id: string;
  first_name: string;
  body: string;
  created_at: string;
};

type WallEntry = {
  id: string;
  answer: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
};

type Commitment = {
  id: string;
  first_name: string;
  commitment: string;
  created_at: string;
};

async function requireAdmin() {
  const cookieStore = cookies();

  const token = cookieStore.get(
    adminCookieName
  )?.value;

  const valid =
    verifyAdminSessionToken(token);

  if (!valid) {
    redirect("/admin/login");
  }
}

async function logoutAdmin() {
  "use server";

  const cookieStore = cookies();

  cookieStore.delete(
    adminCookieName
  );

  redirect("/admin/login");
}

async function deleteCommunityPost(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get("id");

  if (
    typeof id !== "string"
  ) {
    return;
  }

  await supabaseAdmin
    .from(
      "my_turn_community_posts"
    )
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
}

async function deleteCommunityReply(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get("id");

  if (
    typeof id !== "string"
  ) {
    return;
  }

  await supabaseAdmin
    .from(
      "my_turn_community_replies"
    )
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
}

async function deleteWallEntry(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get("id");

  if (
    typeof id !== "string"
  ) {
    return;
  }

  await supabaseAdmin
    .from(
      "my_turn_wall_entries"
    )
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
}

async function deleteCommitment(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get("id");

  if (
    typeof id !== "string"
  ) {
    return;
  }

  await supabaseAdmin
    .from(
      "my_turn_commitments"
    )
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
}

async function deleteRegistration(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get("id");

  if (
    typeof id !== "string"
  ) {
    return;
  }

  await supabaseAdmin
    .from(
      "my_turn_registrations"
    )
    .delete()
    .eq("id", id);

  revalidatePath("/admin");
}

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    new Date(date)
  );
}

export default async function AdminPage() {
  await requireAdmin();

  const [
    registrationsResult,
    postsResult,
    repliesResult,
    wallResult,
    commitmentsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from(
        "my_turn_registrations"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      }),

    supabaseAdmin
      .from(
        "my_turn_community_posts"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      }),

    supabaseAdmin
      .from(
        "my_turn_community_replies"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      }),

    supabaseAdmin
      .from(
        "my_turn_wall_entries"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      }),

    supabaseAdmin
      .from(
        "my_turn_commitments"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const registrations =
    (
      registrationsResult.data ??
      []
    ) as Registration[];

  const posts =
    (
      postsResult.data ??
      []
    ) as CommunityPost[];

  const replies =
    (
      repliesResult.data ??
      []
    ) as CommunityReply[];

  const wallEntries =
    (
      wallResult.data ??
      []
    ) as WallEntry[];

  const commitments =
    (
      commitmentsResult.data ??
      []
    ) as Commitment[];

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      {/* ADMIN INTRO */}
      <section className="px-5 pb-8 pt-10 md:px-10 md:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-white/70 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7196a3]">
                My Turn
              </p>

              <h1 className="mt-3 font-serif text-5xl text-[#29434d]">
                Admin
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-[#607982]">
                Keep an eye on registrations,
                conversations and everything
                being shared across My Turn.
              </p>
            </div>

            <form
              action={logoutAdmin}
            >
              <button
                type="submit"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#536f79] shadow-sm ring-1 ring-white"
              >
                Sign out
              </button>
            </form>
          </div>

          {/* CLICKABLE DASHBOARD */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              href="#registrations"
              label="Registrations"
              number={
                registrations.length
              }
              helper="Founding Session"
            />

            <StatCard
              href="#community"
              label="Community"
              number={
                posts.length
              }
              helper="Posts"
            />

            <StatCard
              href="#community"
              label="Replies"
              number={
                replies.length
              }
              helper="Conversations"
            />

            <StatCard
              href="#wall"
              label="Wall"
              number={
                wallEntries.length
              }
              helper="Shared memories"
            />

            <StatCard
              href="#commitments"
              label="Commitments"
              number={
                commitments.length
              }
              helper="This week"
            />
          </div>
        </div>
      </section>

      {/* ADMIN SECTION NAV */}
      <div className="sticky top-[73px] z-20 border-y border-white/70 bg-[#dfeef4]/95 px-5 py-3 backdrop-blur md:px-10">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          <a
            href="#registrations"
            className="whitespace-nowrap rounded-full bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#55727c] transition hover:bg-white"
          >
            Registrations
          </a>

          <a
            href="#community"
            className="whitespace-nowrap rounded-full bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#55727c] transition hover:bg-white"
          >
            Community
          </a>

          <a
            href="#wall"
            className="whitespace-nowrap rounded-full bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#55727c] transition hover:bg-white"
          >
            Community Wall
          </a>

          <a
            href="#commitments"
            className="whitespace-nowrap rounded-full bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#55727c] transition hover:bg-white"
          >
            Commitments
          </a>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        {/* REGISTRATIONS */}
        <section
          id="registrations"
          className="scroll-mt-36 pt-14"
        >
          <SectionHeading
            eyebrow="Founding Session"
            title="Registrations"
            description="See who is interested, when they can come and what they want My Turn to become."
            count={
              registrations.length
            }
          />

          {registrations.length >
          0 ? (
            <div className="mt-7 space-y-4">
              {registrations.map(
                (
                  person: Registration
                ) => (
                  <article
                    key={
                      person.id
                    }
                    className="rounded-[28px] bg-[#fffdf8] p-6 shadow-sm ring-1 ring-white"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-serif text-2xl text-[#29434d]">
                            {
                              person.first_name
                            }
                          </h3>

                          {person.age_range && (
                            <span className="rounded-full bg-[#edf5f7] px-3 py-1 text-xs font-semibold text-[#607982]">
                              {
                                person.age_range
                              }
                            </span>
                          )}
                        </div>

                        <p className="mt-2 break-all text-sm font-medium text-[#557581]">
                          {
                            person.email
                          }
                        </p>

                        {person.suburb && (
                          <p className="mt-1 text-sm text-[#748a92]">
                            {
                              person.suburb
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs text-[#9aabb0]">
                          {formatDate(
                            person.created_at
                          )}
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                          <InfoBlock
                            title="Days"
                            value={
                              person.preferred_days
                            }
                          />

                          <InfoBlock
                            title="Times"
                            value={
                              person.preferred_times
                            }
                          />

                          <InfoBlock
                            title="Between sessions"
                            value={
                              person.between_sessions
                            }
                          />

                          <InfoBlock
                            title="Interested in"
                            value={
                              person.interests
                            }
                          />

                          <InfoBlock
                            title="Coming along"
                            value={
                              person.bring_someone
                            }
                          />

                          <InfoBlock
                            title="Loved when younger"
                            value={
                              person.childhood_play
                            }
                          />

                          <InfoBlock
                            title="Misses now"
                            value={
                              person.miss_now
                            }
                          />

                          <InfoBlock
                            title="Would love to try"
                            value={
                              person.try_together
                            }
                          />

                          <InfoBlock
                            title="What gets in the way"
                            value={
                              person.barrier
                            }
                          />

                          <InfoBlock
                            title="What she hopes My Turn becomes"
                            value={
                              person.hope
                            }
                          />
                        </div>
                      </div>

                      <form
                        action={
                          deleteRegistration
                        }
                        className="shrink-0"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            person.id
                          }
                        />

                        <button
                          type="submit"
                          className="rounded-full bg-[#f4ece8] px-4 py-2 text-xs font-semibold text-[#815f55]"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No registrations yet." />
          )}
        </section>

        {/* COMMUNITY */}
        <section
          id="community"
          className="scroll-mt-36 pt-20"
        >
          <SectionHeading
            eyebrow="Community"
            title="Conversations"
            description="See the conversations happening between monthly My Turn catch-ups."
            count={posts.length}
          />

          {posts.length > 0 ? (
            <div className="mt-7 space-y-5">
              {posts.map(
                (
                  post: CommunityPost
                ) => {
                  const postReplies =
                    replies.filter(
                      (
                        reply: CommunityReply
                      ) =>
                        reply.post_id ===
                        post.id
                    );

                  return (
                    <article
                      key={
                        post.id
                      }
                      className="rounded-[28px] bg-[#fffdf8] p-6 shadow-sm ring-1 ring-white md:p-8"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="font-semibold text-[#365965]">
                            {
                              post.first_name
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#9aabb0]">
                            {formatDate(
                              post.created_at
                            )}
                          </p>
                        </div>

                        <form
                          action={
                            deleteCommunityPost
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={
                              post.id
                            }
                          />

                          <button
                            type="submit"
                            className="rounded-full bg-[#f4ece8] px-4 py-2 text-xs font-semibold text-[#815f55]"
                          >
                            Delete post
                          </button>
                        </form>
                      </div>

                      <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-[#405d68]">
                        {post.body}
                      </p>

                      {postReplies.length >
                        0 && (
                        <div className="mt-6 space-y-3 border-t border-[#e3eaec] pt-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#80979e]">
                            {
                              postReplies.length
                            }{" "}
                            {postReplies.length ===
                            1
                              ? "reply"
                              : "replies"}
                          </p>

                          {postReplies.map(
                            (
                              reply: CommunityReply
                            ) => (
                              <div
                                key={
                                  reply.id
                                }
                                className="flex gap-4 rounded-[20px] bg-[#edf5f7] p-4"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold text-[#466874]">
                                      {
                                        reply.first_name
                                      }
                                    </p>

                                    <p className="text-xs text-[#9aabb0]">
                                      {formatDate(
                                        reply.created_at
                                      )}
                                    </p>
                                  </div>

                                  <p className="mt-2 whitespace-pre-wrap leading-7 text-[#536d76]">
                                    {
                                      reply.body
                                    }
                                  </p>
                                </div>

                                <form
                                  action={
                                    deleteCommunityReply
                                  }
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={
                                      reply.id
                                    }
                                  />

                                  <button
                                    type="submit"
                                    className="text-xs font-semibold text-[#815f55] underline underline-offset-4"
                                  >
                                    Delete
                                  </button>
                                </form>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <EmptyState text="No community conversations yet." />
          )}
        </section>

        {/* WALL */}
        <section
          id="wall"
          className="scroll-mt-36 pt-20"
        >
          <SectionHeading
            eyebrow="Community Wall"
            title="Shared memories"
            description="See the memories women have chosen to share publicly with My Turn."
            count={
              wallEntries.length
            }
          />

          {wallEntries.length >
          0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {wallEntries.map(
                (
                  entry: WallEntry
                ) => (
                  <article
                    key={
                      entry.id
                    }
                    className="rounded-[26px] bg-[#fffdf8] p-5 shadow-sm ring-1 ring-white"
                  >
                    {entry.image_url && (
                      <img
                        src={
                          entry.image_url
                        }
                        alt=""
                        className="mb-4 max-h-[250px] w-full rounded-[18px] object-contain"
                      />
                    )}

                    {entry.answer && (
                      <p className="font-serif text-xl italic leading-8 text-[#314c57]">
                        “
                        {
                          entry.answer
                        }
                        ”
                      </p>
                    )}

                    <p className="mt-3 text-xs text-[#9aabb0]">
                      {formatDate(
                        entry.created_at
                      )}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e4ebed] pt-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#83999f]">
                        {
                          entry.category
                        }
                      </span>

                      <form
                        action={
                          deleteWallEntry
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            entry.id
                          }
                        />

                        <button
                          type="submit"
                          className="text-xs font-semibold text-[#815f55] underline underline-offset-4"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No shared memories yet." />
          )}
        </section>

        {/* COMMITMENTS */}
        <section
          id="commitments"
          className="scroll-mt-36 pt-20"
        >
          <SectionHeading
            eyebrow="This week"
            title="Community commitments"
            description="See what women are choosing to make a little more room for."
            count={
              commitments.length
            }
          />

          {commitments.length >
          0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {commitments.map(
                (
                  item: Commitment
                ) => (
                  <article
                    key={
                      item.id
                    }
                    className="rounded-[26px] bg-[#fffdf8] p-6 shadow-sm ring-1 ring-white"
                  >
                    <p className="font-serif text-2xl leading-8 text-[#314c57]">
                      “
                      {
                        item.commitment
                      }
                      ”
                    </p>

                    <p className="mt-3 text-xs text-[#9aabb0]">
                      {formatDate(
                        item.created_at
                      )}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d949b]">
                        {
                          item.first_name
                        }
                      </p>

                      <form
                        action={
                          deleteCommitment
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            item.id
                          }
                        />

                        <button
                          type="submit"
                          className="text-xs font-semibold text-[#815f55] underline underline-offset-4"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <EmptyState text="No commitments yet." />
          )}
        </section>

        <footer className="mt-20 border-t border-white/60 py-8 text-center text-xs text-[#789099]">
          Private My Turn admin area
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  href,
  label,
  number,
  helper,
}: {
  href: string;
  label: string;
  number: number;
  helper: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-[24px] bg-[#fffdf8] p-5 shadow-sm ring-1 ring-white transition hover:-translate-y-1 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d989f]">
        {label}
      </p>

      <p className="mt-3 font-serif text-4xl text-[#29434d]">
        {number}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-[#82969d]">
          {helper}
        </p>

        <span className="text-sm text-[#66848e] transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  count,
}: {
  eyebrow: string;
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7196a3]">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-serif text-4xl text-[#29434d]">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-[#607982]">
          {description}
        </p>
      </div>

      {typeof count ===
        "number" && (
        <span className="self-start rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[#557581] ring-1 ring-white sm:self-auto">
          {count}
        </span>
      )}
    </div>
  );
}

function InfoBlock({
  title,
  value,
}: {
  title: string;
  value:
    | string
    | string[]
    | null
    | undefined;
}) {
  if (
    !value ||
    (Array.isArray(value) &&
      value.length === 0)
  ) {
    return null;
  }

  const displayValue =
    Array.isArray(value)
      ? value.join(", ")
      : value;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8aa0a7]">
        {title}
      </p>

      <p className="mt-2 whitespace-pre-wrap leading-7 text-[#526d76]">
        {displayValue}
      </p>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-7 rounded-[26px] bg-white/45 p-7 text-center text-[#6c838b]">
      {text}
    </div>
  );
}