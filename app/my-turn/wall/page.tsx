"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Category =
  | "all"
  | "play"
  | "connection"
  | "creative"
  | "movement"
  | "adventure"
  | "quiet";

type WallEntry = {
  id: string;
  answer: string;
  image_url?: string | null;
  category: Exclude<Category, "all">;
  created_at?: string;
  isSeed?: boolean;
};

const categories: {
  id: Category;
  label: string;
}[] = [
  { id: "all", label: "Everything" },
  { id: "play", label: "Play" },
  { id: "connection", label: "Connection" },
  { id: "creative", label: "Making things" },
  { id: "movement", label: "Movement" },
  { id: "adventure", label: "Adventure" },
  { id: "quiet", label: "Quiet time" },
];

const starterMemories: WallEntry[] = [
  {
    id: "seed-1",
    answer:
      "Riding my bike around the neighbourhood until someone called me home.",
    category: "adventure",
    isSeed: true,
  },
  {
    id: "seed-2",
    answer:
      "Making forts in the lounge room and staying in them for the entire afternoon.",
    category: "play",
    isSeed: true,
  },
  {
    id: "seed-3",
    answer:
      "Reading for hours without feeling guilty that I should be doing something else.",
    category: "quiet",
    isSeed: true,
  },
  {
    id: "seed-4",
    answer:
      "Dancing around my bedroom with the music ridiculously loud.",
    category: "movement",
    isSeed: true,
  },
  {
    id: "seed-5",
    answer:
      "Making friendship bracelets and giving them to absolutely everyone.",
    category: "creative",
    isSeed: true,
  },
  {
    id: "seed-6",
    answer:
      "Sitting around with my friends talking about nothing and somehow laughing for hours.",
    category: "connection",
    isSeed: true,
  },
  {
    id: "seed-7",
    answer:
      "Climbing trees and seeing how high I could get before someone yelled at me to come down.",
    category: "adventure",
    isSeed: true,
  },
  {
    id: "seed-8",
    answer:
      "Making mud pies, potions and things that had absolutely no purpose.",
    category: "creative",
    isSeed: true,
  },
  {
    id: "seed-9",
    answer:
      "Roller skating. I wasn't particularly good at it. I just loved doing it.",
    category: "movement",
    isSeed: true,
  },
];

const reflectionPrompts = [
  "What did you love doing before life became so busy?",
  "What could you happily do for an entire afternoon as a kid?",
  "What made you laugh until your stomach hurt?",
  "Where did you go when you wanted to feel free?",
  "What did you make just because you felt like making it?",
  "Who were you with when you felt completely yourself?",
];

export default function CommunityWallPage() {
  const [entries, setEntries] =
    useState<WallEntry[]>(starterMemories);

  const [filter, setFilter] =
    useState<Category>("all");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [answer, setAnswer] =
    useState("");

  const [category, setCategory] =
    useState<
      Exclude<Category, "all">
    >("play");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [imageName, setImageName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [
    promptIndex,
    setPromptIndex,
  ] = useState(0);

  useEffect(() => {
    loadWallEntries();
  }, []);

  async function loadWallEntries() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from(
          "my_turn_wall_entries"
        )
        .select(
          "id, answer, image_url, category, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Community wall load error:",
        error
      );

      setEntries(
        starterMemories
      );

      setLoading(false);

      return;
    }

    const sharedEntries: WallEntry[] =
      (data ?? []).map(
        (entry) => ({
          id: entry.id,
          answer:
            entry.answer ?? "",
          image_url:
            entry.image_url,
          category:
            entry.category as Exclude<
              Category,
              "all"
            >,
          created_at:
            entry.created_at,
        })
      );

    setEntries([
      ...sharedEntries,
      ...starterMemories,
    ]);

    setLoading(false);
  }

  const visibleEntries =
    useMemo(() => {
      if (filter === "all") {
        return entries;
      }

      return entries.filter(
        (entry) =>
          entry.category ===
          filter
      );
    }, [entries, filter]);

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setMessage(
        "Please choose an image file."
      );
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setMessage(
        "Please choose an image smaller than 2 MB."
      );
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );

    setImageName(file.name);
    setMessage("");
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(null);
    setImagePreview(null);
    setImageName("");
  }

  async function uploadImage() {
    if (!imageFile) {
      return null;
    }

    const extension =
      imageFile.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("my-turn-wall")
      .upload(
        fileName,
        imageFile,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            imageFile.type,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from("my-turn-wall")
        .getPublicUrl(fileName);

    return data.publicUrl;
  }

    async function saveEntry(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanAnswer =
      answer.trim();

    if (
      !cleanAnswer &&
      !imageFile
    ) {
      setMessage(
        "Write something or upload your handwritten answer first."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const imageUrl =
        await uploadImage();

      const response =
        await fetch(
          "/api/community-wall",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              answer:
                cleanAnswer,
              imageUrl,
              category,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Something went wrong while adding your memory."
        );
      }

      const newEntry: WallEntry =
        {
          id:
            result.entry.id,
          answer:
            result.entry.answer ??
            "",
          image_url:
            result.entry
              .imageUrl ??
            null,
          category:
            result.entry
              .category as Exclude<
              Category,
              "all"
            >,
          created_at:
            result.entry
              .createdAt,
        };

      setEntries(
        (current) => [
          newEntry,
          ...current,
        ]
      );

      setAnswer("");
      removeImage();

      setShowAddForm(false);
      setFilter("all");

      setMessage("");
    } catch (error) {
      console.error(
        "Community wall save error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding your memory. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function nextPrompt() {
    setPromptIndex(
      (current) =>
        (current + 1) %
        reflectionPrompts.length
    );
  }

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-14 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[340px] opacity-20 md:block">
          <img
            src="/images/midlife-mentoring-wildflowers.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            The My Turn Community Wall
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-[#24373d] md:text-7xl">
            Look what we&apos;ve been
            missing.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#526b75]">
            Different women. Different
            lives. Yet so many of us
            seem to miss remarkably
            similar things.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#526b75]">
            Read a few. Notice which
            ones make you smile,
            remember something, or
            quietly think, “Me too.”
          </p>
        </div>
      </section>

      {/* REFLECTION */}
      <section className="px-6 pb-14 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[34px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7296a3]">
                  A question to sit
                  with
                </p>

                <p className="mt-4 font-serif text-3xl leading-tight text-[#29434d] md:text-4xl">
                  {
                    reflectionPrompts[
                      promptIndex
                    ]
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={nextPrompt}
                className="shrink-0 self-start rounded-full bg-[#edf5f7] px-5 py-3 text-sm font-semibold text-[#547682] transition hover:bg-[#e1eff2] md:self-center"
              >
                Ask me another →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="px-6 pb-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6f8f9a]">
                Explore the wall
              </p>

              <h2 className="mt-2 font-serif text-3xl text-[#29434d]">
                What are women
                remembering?
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAddForm(
                  true
                );
                setMessage("");
              }}
              className="rounded-full bg-[#284f5d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
            >
              Add my memory
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map(
              (item) => {
                const selected =
                  filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFilter(
                        item.id
                      )
                    }
                    className={[
                      "rounded-full px-5 py-2.5 text-sm font-medium transition",
                      selected
                        ? "bg-[#294f5c] text-white"
                        : "bg-white/65 text-[#55727c] ring-1 ring-white hover:bg-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* WALL */}
      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-[30px] bg-white/55 p-10 text-center">
              <p className="font-serif text-2xl text-[#29434d]">
                Gathering everyone&apos;s
                memories...
              </p>
            </div>
          ) : visibleEntries.length >
            0 ? (
            <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
              {visibleEntries.map(
                (entry) => (
                  <article
                    key={entry.id}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-[28px] bg-white/78 p-5 shadow-sm ring-1 ring-white"
                  >
                    {entry.image_url && (
                      <div className="mb-5 overflow-hidden rounded-[20px] bg-[#f5f2eb]">
                        <img
                          src={
                            entry.image_url
                          }
                          alt="Handwritten My Turn memory"
                          className="max-h-[420px] w-full object-contain"
                        />
                      </div>
                    )}

                    {entry.answer && (
                      <p className="font-serif text-[22px] italic leading-8 text-[#314c57]">
                        “
                        {
                          entry.answer
                        }
                        ”
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e1e9eb] pt-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#83999f]">
                        {
                          categories.find(
                            (
                              item
                            ) =>
                              item.id ===
                              entry.category
                          )?.label
                        }
                      </span>

                      <span className="font-serif text-sm italic text-[#98a9ae]">
                        My Turn
                      </span>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="rounded-[30px] bg-white/55 p-10 text-center">
              <p className="font-serif text-2xl text-[#29434d]">
                Nothing here yet.
              </p>

              <p className="mt-3 text-[#687f88]">
                Maybe yours should
                be the first.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ADD FORM */}
      {showAddForm && (
        <section className="bg-[#cfe2e9] px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[36px] bg-[#fffdf8] p-7 shadow-lg md:p-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7196a3]">
                    Add to the wall
                  </p>

                  <h2 className="mt-3 font-serif text-4xl text-[#29434d]">
                    What came back
                    to you?
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(
                      false
                    );

                    setMessage("");
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf5f7] text-xl text-[#55747e] transition hover:bg-[#e3eff2]"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <p className="mt-5 leading-7 text-[#617981]">
                This Community Wall is
                shared. Anything you add
                here may be seen by other
                women using My Turn.
              </p>

              <form
                onSubmit={saveEntry}
                className="mt-8 space-y-6"
              >
                <div>
                  <label className="text-sm font-semibold text-[#405e68]">
                    My memory
                  </label>

                  <textarea
                    value={answer}
                    onChange={(
                      event
                    ) =>
                      setAnswer(
                        event.target
                          .value
                      )
                    }
                    maxLength={1000}
                    rows={5}
                    placeholder="I used to love..."
                    className="mt-2 w-full resize-none rounded-[22px] border border-[#d8e2e5] bg-white px-4 py-4 text-base leading-7 text-[#314c57] outline-none transition placeholder:text-[#9cabb0] focus:border-[#759ca9]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#405e68]">
                    What does it
                    remind you of?
                  </label>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {categories
                      .filter(
                        (item) =>
                          item.id !==
                          "all"
                      )
                      .map(
                        (item) => {
                          const selected =
                            category ===
                            item.id;

                          return (
                            <button
                              key={
                                item.id
                              }
                              type="button"
                              onClick={() =>
                                setCategory(
                                  item.id as Exclude<
                                    Category,
                                    "all"
                                  >
                                )
                              }
                              className={[
                                "rounded-[18px] border px-4 py-3 text-left text-sm font-medium transition",
                                selected
                                  ? "border-[#719ba8] bg-[#e8f2f4] text-[#365c68]"
                                  : "border-[#e0e7e9] bg-white text-[#617981] hover:bg-[#f5f9fa]",
                              ].join(
                                " "
                              )}
                            >
                              {
                                item.label
                              }
                            </button>
                          );
                        }
                      )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#405e68]">
                    Or upload your
                    handwriting
                  </p>

                  {!imagePreview ? (
                    <label className="mt-3 flex cursor-pointer items-center justify-center rounded-[22px] border border-dashed border-[#aac1c9] bg-[#eef6f7] px-5 py-6 text-center text-sm font-semibold text-[#527581] transition hover:bg-[#e5f1f3]">
                      Upload a photo
                      of my handwritten
                      answer

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={
                          handleImageUpload
                        }
                      />
                    </label>
                  ) : (
                    <div className="mt-3 rounded-[22px] border border-[#dce5e7] bg-white p-3">
                      <img
                        src={
                          imagePreview
                        }
                        alt="Preview of handwritten answer"
                        className="max-h-[320px] w-full rounded-[16px] object-contain"
                      />

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="min-w-0 truncate text-xs text-[#758c94]">
                          {imageName}
                        </p>

                        <button
                          type="button"
                          onClick={
                            removeImage
                          }
                          className="shrink-0 text-xs font-semibold text-[#557681] underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {message && (
                  <p className="rounded-[18px] bg-[#f4ece8] px-4 py-3 text-sm text-[#775b50]">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="w-full rounded-full bg-[#284f5d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Adding your memory..."
                    : "Add mine to the shared wall"}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* REFLECTION */}
      <section className="bg-white/35 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
                Look a little closer
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                Maybe we haven&apos;t
                lost ourselves
                completely.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-[#586f78]">
              <p>
                The woman who danced,
                made things, explored,
                read, climbed, laughed
                and talked for hours
                may still be there.
              </p>

              <p>
                She may just have had
                a lot of
                responsibilities
                placed in front of her.
              </p>

              <p className="font-serif text-xl italic text-[#405c66]">
                Sometimes remembering
                is the beginning of
                making room for her
                again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT STEP */}
      <section className="px-6 py-20 text-center md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
            Now what?
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
            Remembering is lovely.
            <br />
            Doing something with it
            is better.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#586f78]">
            Take what came up for you
            and find one tiny way to
            bring a little more of it
            into today.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/my-turn/today"
              className="rounded-full bg-[#24373d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#314c57]"
            >
              What do I need today?
            </Link>

            <Link
              href="/#founding-night"
              className="rounded-full bg-white/75 px-7 py-4 text-sm font-semibold text-[#456570] ring-1 ring-white transition hover:bg-white"
            >
              Meet us in real life
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/50 px-6 py-8 text-center text-sm text-[#607982]">
        My Turn by Never Too Old to
        Play · Chirnside Park, Victoria
      </footer>
    </main>
  );
}