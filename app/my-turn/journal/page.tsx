"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Step =
  | "arrive"
  | "miss"
  | "quiet"
  | "more"
  | "small"
  | "future"
  | "finish";

type Mood =
  | "tired"
  | "restless"
  | "lonely"
  | "hopeful"
  | "stuck"
  | "peaceful"
  | "unsure";

type QuietPart =
  | "playful"
  | "creative"
  | "social"
  | "adventurous"
  | "peaceful"
  | "curious";

type MoreOf =
  | "time"
  | "people"
  | "movement"
  | "laughter"
  | "nature"
  | "creativity"
  | "adventure"
  | "quiet";

const steps: Step[] = [
  "arrive",
  "miss",
  "quiet",
  "more",
  "small",
  "future",
  "finish",
];

const moodOptions: { id: Mood; label: string }[] = [
  { id: "tired", label: "Tired" },
  { id: "restless", label: "Restless" },
  { id: "lonely", label: "A little lonely" },
  { id: "hopeful", label: "Hopeful" },
  { id: "stuck", label: "A bit stuck" },
  { id: "peaceful", label: "Peaceful" },
  { id: "unsure", label: "I’m not sure" },
];

const quietOptions: { id: QuietPart; label: string }[] = [
  { id: "playful", label: "The playful me" },
  { id: "creative", label: "The creative me" },
  { id: "social", label: "The social me" },
  { id: "adventurous", label: "The adventurous me" },
  { id: "peaceful", label: "The peaceful me" },
  { id: "curious", label: "The curious me" },
];

const moreOptions: { id: MoreOf; label: string }[] = [
  { id: "time", label: "Time" },
  { id: "people", label: "People" },
  { id: "movement", label: "Movement" },
  { id: "laughter", label: "Laughter" },
  { id: "nature", label: "Nature" },
  { id: "creativity", label: "Creativity" },
  { id: "adventure", label: "Adventure" },
  { id: "quiet", label: "Quiet" },
];

const imageByStep: Record<Step, string> = {
  arrive: "/images/midlife-mentoring-morning-sun.png",
  miss: "/images/midlife-mentoring-beach-shells.png",
  quiet: "/images/midlife-mentoring-birds.png",
  more: "/images/midlife-mentoring-waterfall.png",
  small: "/images/midlife-mentoring-winding-path.png",
  future: "/images/midlife-mentoring-open-sky.png",
  finish: "/images/midlife-mentoring-lake.png",
};

export default function QuietSpacePage() {
  const [step, setStep] = useState<Step>("arrive");

  const [mood, setMood] = useState<Mood | null>(null);
  const [missing, setMissing] = useState("");
  const [quietPart, setQuietPart] = useState<QuietPart | null>(null);
  const [moreOf, setMoreOf] = useState<MoreOf[]>([]);
  const [smallStep, setSmallStep] = useState("");
  const [futureNote, setFutureNote] = useState("");

  const [message, setMessage] = useState("");

  const stepIndex = steps.indexOf(step);

  const reflectionText = useMemo(() => {
    const moreLabels = moreOf
      .map((id) => moreOptions.find((item) => item.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const quietLabel = quietOptions.find(
      (item) => item.id === quietPart
    )?.label;

    const moodLabel = moodOptions.find(
      (item) => item.id === mood
    )?.label;

    return [
      moodLabel ? `Today I’m arriving feeling: ${moodLabel}` : "",
      missing.trim()
        ? `What I’ve been missing:\n${missing.trim()}`
        : "",
      quietLabel
        ? `The part of me that feels quieter: ${quietLabel}`
        : "",
      moreLabels
        ? `I’d like more of: ${moreLabels}`
        : "",
      smallStep.trim()
        ? `One small thing I might try:\n${smallStep.trim()}`
        : "",
      futureNote.trim()
        ? `What I want future me to remember:\n${futureNote.trim()}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [
    mood,
    missing,
    quietPart,
    moreOf,
    smallStep,
    futureNote,
  ]);

  function nextStep() {
    const next = steps[stepIndex + 1];

    if (next) {
      setStep(next);
      setMessage("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousStep() {
    const previous = steps[stepIndex - 1];

    if (previous) {
      setStep(previous);
      setMessage("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function toggleMore(id: MoreOf) {
    setMoreOf((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function savePrivately() {
    if (!reflectionText) {
      setMessage("There’s nothing to save yet.");
      return;
    }

    try {
      const existing = window.localStorage.getItem(
        "my-turn-quiet-notes"
      );

      const parsed = existing
        ? JSON.parse(existing)
        : [];

      const notes = Array.isArray(parsed)
        ? parsed
        : [];

      notes.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        text: reflectionText,
      });

      window.localStorage.setItem(
        "my-turn-quiet-notes",
        JSON.stringify(notes)
      );

      setMessage(
        "Saved only in this browser on this device. Nothing was sent to My Turn."
      );
    } catch {
      setMessage(
        "This browser couldn’t save your note locally. You can still email or download it."
      );
    }
  }

  function emailToMyself() {
    if (!reflectionText) {
      setMessage("There’s nothing to email yet.");
      return;
    }

    const subject = encodeURIComponent(
      "A note from My Turn"
    );

    const body = encodeURIComponent(
      `A little note from me to me.\n\n${reflectionText}\n\nI don’t need to fix everything today. This is simply what mattered to me when I wrote it.`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function downloadCopy() {
    if (!reflectionText) {
      setMessage("There’s nothing to download yet.");
      return;
    }

    const content = `MY TURN — MY QUIET SPACE

${reflectionText}

You don’t have to turn this into a goal.
You don’t have to have worked it all out.
This was simply what mattered to you today.
`;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    link.download = `my-turn-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMessage(
      "Your private copy has been downloaded."
    );
  }

  function resetJourney() {
    setStep("arrive");
    setMood(null);
    setMissing("");
    setQuietPart(null);
    setMoreOf([]);
    setSmallStep("");
    setFutureNote("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <section className="px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
                My Quiet Space
              </p>

              <h1 className="mt-3 font-serif text-4xl text-[#24373d] md:text-5xl">
                A few quiet minutes for you.
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#607982]">
                One question at a time. Skip anything that
                doesn&apos;t feel useful.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {steps.map((item, index) => (
                <div
                  key={item}
                  className={[
                    "h-1.5 flex-1 rounded-full transition",
                    index <= stepIndex
                      ? "bg-[#567f8d]"
                      : "bg-white/60",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-[40px] bg-[#fffdf8] shadow-[0_24px_80px_rgba(50,77,87,0.12)] ring-1 ring-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[330px] overflow-hidden bg-[#f4f1e8] lg:min-h-[650px]">
              <Image
                src={imageByStep[step]}
                alt="Soft watercolour nature illustration"
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#eef6f7]/35 via-transparent to-white/10" />

              <div className="absolute bottom-6 left-6 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#607d87] backdrop-blur">
                My Quiet Space
              </div>
            </div>

            <div className="flex min-h-[650px] flex-col p-7 md:p-10 lg:p-12">
              <div className="mb-auto">
                {step === "arrive" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Arrive
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      Before you write anything, how are you
                      arriving today?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      Don&apos;t overthink it. Pick whatever
                      feels closest.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {moodOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setMood(item.id)
                          }
                          className={[
                            "rounded-[22px] border px-5 py-4 text-left text-base font-medium transition",
                            mood === item.id
                              ? "border-[#6e98a6] bg-[#e7f1f4] text-[#345a66]"
                              : "border-[#e0e8ea] bg-white text-[#5a727b] hover:bg-[#f4f9fa]",
                          ].join(" ")}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === "miss" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Remember
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      What have you been missing lately?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      A feeling. A person. A place. An activity.
                      Or a version of yourself.
                    </p>

                    <textarea
                      value={missing}
                      onChange={(event) =>
                        setMissing(event.target.value)
                      }
                      rows={7}
                      placeholder="I miss..."
                      className="mt-8 w-full resize-none rounded-[24px] border border-[#dae4e6] bg-white px-5 py-5 text-lg leading-8 text-[#314c57] outline-none transition placeholder:text-[#a1afb4] focus:border-[#759ca9]"
                    />
                  </>
                )}

                {step === "quiet" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Notice
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      What part of you has gone a little quiet?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      You don&apos;t have to explain it. Just
                      notice which one catches your attention.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {quietOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setQuietPart(item.id)
                          }
                          className={[
                            "rounded-[22px] border px-5 py-4 text-left font-serif text-xl transition",
                            quietPart === item.id
                              ? "border-[#6e98a6] bg-[#e7f1f4] text-[#345a66]"
                              : "border-[#e0e8ea] bg-white text-[#46616a] hover:bg-[#f4f9fa]",
                          ].join(" ")}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === "more" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Want
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      What would you like a little more of?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      Choose as many as you want.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {moreOptions.map((item) => {
                        const selected =
                          moreOf.includes(item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              toggleMore(item.id)
                            }
                            className={[
                              "rounded-[22px] border px-5 py-4 text-left font-serif text-xl transition",
                              selected
                                ? "border-[#6e98a6] bg-[#e7f1f4] text-[#345a66]"
                                : "border-[#e0e8ea] bg-white text-[#46616a] hover:bg-[#f4f9fa]",
                            ].join(" ")}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === "small" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Tiny next step
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      What would feel small enough to actually
                      do?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      Not a new routine. Not a big promise. Just
                      something possible.
                    </p>

                    <div className="mt-7 space-y-3">
                      {[
                        "Put one song on and move.",
                        "Take my drink outside.",
                        "Message someone I miss.",
                        "Read for ten minutes.",
                        "Go somewhere just because I feel like it.",
                        "Make something without needing it to be good.",
                      ].map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          onClick={() =>
                            setSmallStep(idea)
                          }
                          className={[
                            "w-full rounded-[20px] border px-5 py-4 text-left transition",
                            smallStep === idea
                              ? "border-[#6e98a6] bg-[#e7f1f4] text-[#345a66]"
                              : "border-[#e0e8ea] bg-white text-[#5a727b] hover:bg-[#f4f9fa]",
                          ].join(" ")}
                        >
                          {idea}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={smallStep}
                      onChange={(event) =>
                        setSmallStep(event.target.value)
                      }
                      rows={3}
                      placeholder="Or write your own..."
                      className="mt-5 w-full resize-none rounded-[22px] border border-[#dae4e6] bg-white px-5 py-4 text-base leading-7 text-[#314c57] outline-none transition placeholder:text-[#a1afb4] focus:border-[#759ca9]"
                    />
                  </>
                )}

                {step === "future" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Future me
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      What do you want future-you to remember?
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      Something you don&apos;t want to lose
                      sight of once life gets busy again.
                    </p>

                    <textarea
                      value={futureNote}
                      onChange={(event) =>
                        setFutureNote(
                          event.target.value
                        )
                      }
                      rows={8}
                      placeholder="I want to remember..."
                      className="mt-8 w-full resize-none rounded-[24px] border border-[#dae4e6] bg-white px-5 py-5 text-lg leading-8 text-[#314c57] outline-none transition placeholder:text-[#a1afb4] focus:border-[#759ca9]"
                    />
                  </>
                )}

                {step === "finish" && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
                      Your note
                    </p>

                    <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                      This one is yours.
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#607982]">
                      Nothing here is posted to the Community
                      Wall or sent to My Turn.
                    </p>

                    <div className="mt-8 max-h-[300px] overflow-y-auto rounded-[26px] bg-[#edf5f7] p-6">
                      <pre className="whitespace-pre-wrap font-serif text-lg leading-8 text-[#405d68]">
                        {reflectionText ||
                          "Your reflection will appear here."}
                      </pre>
                    </div>

                    <div className="mt-7 grid gap-3">
                      <button
                        type="button"
                        onClick={savePrivately}
                        className="rounded-[22px] bg-[#284f5d] px-6 py-4 text-left text-white transition hover:bg-[#356b7b]"
                      >
                        <p className="font-serif text-xl">
                          Keep it here privately
                        </p>

                        <p className="mt-1 text-sm text-[#d7e6ea]">
                          Saved only in this browser on this
                          device.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={emailToMyself}
                        className="rounded-[22px] bg-white px-6 py-4 text-left ring-1 ring-[#dce6e8] transition hover:bg-[#f6fafb]"
                      >
                        <p className="font-serif text-xl text-[#314c57]">
                          Email it to myself
                        </p>

                        <p className="mt-1 text-sm text-[#72868d]">
                          Opens your own email app with the note
                          already filled in.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={downloadCopy}
                        className="rounded-[22px] bg-white px-6 py-4 text-left ring-1 ring-[#dce6e8] transition hover:bg-[#f6fafb]"
                      >
                        <p className="font-serif text-xl text-[#314c57]">
                          Download my private copy
                        </p>

                        <p className="mt-1 text-sm text-[#72868d]">
                          Save it wherever feels right for you.
                        </p>
                      </button>
                    </div>

                    {message && (
                      <p className="mt-5 rounded-[18px] bg-[#e7f1f4] px-4 py-3 text-sm leading-6 text-[#52727d]">
                        {message}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="mt-10 border-t border-[#e2e9eb] pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    {stepIndex > 0 &&
                      step !== "finish" && (
                        <button
                          type="button"
                          onClick={previousStep}
                          className="rounded-full px-5 py-3 text-sm font-semibold text-[#617b84] transition hover:bg-[#edf5f7]"
                        >
                          ← Back
                        </button>
                      )}

                    {step === "finish" && (
                      <button
                        type="button"
                        onClick={resetJourney}
                        className="rounded-full px-5 py-3 text-sm font-semibold text-[#617b84] transition hover:bg-[#edf5f7]"
                      >
                        Start again
                      </button>
                    )}
                  </div>

                  {step !== "finish" && (
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="text-sm font-medium text-[#7b9198]"
                      >
                        Skip this
                      </button>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
                      >
                        Continue →
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-5 text-xs leading-5 text-[#84989f]">
                  You can skip anything that doesn&apos;t feel
                  useful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-[28px] bg-white/45 p-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-serif text-2xl text-[#314c57]">
              Want something lighter?
            </p>

            <p className="mt-2 text-sm leading-6 text-[#667e87]">
              Head back to play, ideas and little things you
              might actually enjoy doing.
            </p>
          </div>

          <Link
            href="/my-turn/list"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#456873] shadow-sm ring-1 ring-white"
          >
            Explore My Turn List
          </Link>
        </div>
      </section>
    </main>
  );
}