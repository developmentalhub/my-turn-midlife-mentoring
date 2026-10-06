"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Feeling =
  | "flat"
  | "restless"
  | "lonely"
  | "overwhelmed"
  | "bored"
  | "good";

type TimeOption = "2" | "10" | "30" | "out";

type CommunityChoice =
  | "go"
  | "make"
  | "move"
  | "learn"
  | "hangout"
  | "brave";

type Suggestion = {
  title: string;
  description: string;
  category: string;
  closing: string;
};

const feelings: {
  id: Feeling;
  label: string;
  description: string;
}[] = [
  {
    id: "flat",
    label: "A bit flat",
    description: "I need something to gently wake me up.",
  },
  {
    id: "restless",
    label: "Restless",
    description: "I need somewhere for this energy to go.",
  },
  {
    id: "lonely",
    label: "A little lonely",
    description: "I think I need some human connection.",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Everything feels like a lot today.",
  },
  {
    id: "bored",
    label: "Bored",
    description: "I want something different.",
  },
  {
    id: "good",
    label: "Actually pretty good",
    description: "I have a little energy to play with.",
  },
];

const times: {
  id: TimeOption;
  label: string;
  description: string;
}[] = [
  {
    id: "2",
    label: "2 minutes",
    description: "Tiny is enough today.",
  },
  {
    id: "10",
    label: "10 minutes",
    description: "I have a little space.",
  },
  {
    id: "30",
    label: "30 minutes",
    description: "Give me something I can sink into.",
  },
  {
    id: "out",
    label: "Get me out of the house",
    description: "I need a change of scenery.",
  },
];

const communityChoices: {
  id: CommunityChoice;
  title: string;
  intro: string;
  examples: string;
  responseTitle: string;
  response: string;
}[] = [
  {
    id: "go",
    title: "Go somewhere",
    intro:
      "I’d probably do more if someone said, “Come on, I’ll go with you.”",
    examples:
      "Markets, walks, day trips, gardens, galleries, live music, little local adventures.",
    responseTitle: "Maybe you’re missing shared adventures.",
    response:
      "Not huge bucket-list adventures. Just having someone to message and say, “Do you want to go and check this out with me?”",
  },
  {
    id: "make",
    title: "Make something",
    intro:
      "I miss using my hands and making things just because I enjoy it.",
    examples:
      "Craft, pottery, painting, cooking, gardening, sewing, decorating, messy creative projects.",
    responseTitle: "Maybe you’re missing creativity without pressure.",
    response:
      "You don’t have to become an artist or start a side hustle. You might simply need permission to make things badly with other people.",
  },
  {
    id: "move",
    title: "Move for fun",
    intro:
      "I’d like to move more, but I don’t necessarily want another exercise program.",
    examples:
      "Dancing, walking, swimming, games, casual sport, music, trying silly movement challenges.",
    responseTitle: "Maybe you’re missing movement that feels like play.",
    response:
      "Movement doesn’t have to mean workouts, tracking or performance. Sometimes it can simply mean laughing and using your body again.",
  },
  {
    id: "learn",
    title: "Learn something",
    intro:
      "I miss being curious about things that have nothing to do with work or responsibility.",
    examples:
      "Books, speakers, workshops, new skills, interesting conversations, learning something completely random.",
    responseTitle: "Maybe the curious part of you needs feeding.",
    response:
      "You might not need another qualification. You might just want to sit with interesting women and discover something new together.",
  },
  {
    id: "hangout",
    title: "Just hang out",
    intro:
      "I don’t need another organised activity. I think I just miss having people around.",
    examples:
      "Coffee, long conversations, laughing, sitting outside, casual dinners, doing nothing particularly important.",
    responseTitle: "Maybe you’re missing easy company.",
    response:
      "The kind where nobody needs anything from you and there doesn’t have to be a reason for getting together.",
  },
  {
    id: "brave",
    title: "Be a little braver",
    intro:
      "There are things I’d probably try if I didn’t have to walk into them alone.",
    examples:
      "Going somewhere new, joining something, performing, travelling locally, trying something you might be terrible at.",
    responseTitle: "Maybe you don’t need more confidence first.",
    response:
      "Maybe confidence comes after having someone beside you saying, “I’ll try it too.”",
  },
];

const suggestions: Record<Feeling, Record<TimeOption, Suggestion>> = {
  flat: {
    "2": {
      title: "Put one song on.",
      description:
        "Choose a song that used to make you feel something. Stand up, stretch, sway, dance badly or simply listen to the whole thing without doing anything else.",
      category: "Movement",
      closing:
        "You don’t have to create energy. Just give your body a chance to find some.",
    },
    "10": {
      title: "Take your drink outside.",
      description:
        "Tea, coffee, water, whatever you have. Sit somewhere different and notice five things you would normally walk straight past.",
      category: "Nature",
      closing: "Nothing needs to be achieved in these ten minutes.",
    },
    "30": {
      title: "Find something you used to enjoy.",
      description:
        "Pick up a book, sketch, garden, make something, put music on or revisit something you haven’t touched for years. You do not need to be good at it.",
      category: "Remember",
      closing: "The point is not to finish. The point is to begin.",
    },
    out: {
      title: "Go somewhere without an errand.",
      description:
        "Walk around a park, browse a bookshop, sit somewhere with a coffee or visit somewhere nearby simply because you feel like it.",
      category: "Adventure",
      closing:
        "You are allowed to go somewhere without needing a productive reason.",
    },
  },

  restless: {
    "2": {
      title: "Shake it out.",
      description:
        "Stand up and shake your hands, arms and legs. Roll your shoulders. Stretch tall. Move however your body wants to move for two minutes.",
      category: "Movement",
      closing: "It doesn’t need to look like exercise.",
    },
    "10": {
      title: "Walk without a destination.",
      description:
        "Step outside and walk for five minutes in one direction, then turn around. Leave your usual pace behind.",
      category: "Movement",
      closing: "Let movement do some of the thinking for you.",
    },
    "30": {
      title: "Do something physical and playful.",
      description:
        "Dance, kick a ball, shoot hoops, garden, skip, swim, stretch, throw something for the dog or make up your own ridiculous movement challenge.",
      category: "Play",
      closing: "Movement doesn’t have to be serious to count.",
    },
    out: {
      title: "Find somewhere with space.",
      description:
        "Go somewhere you can walk, wander, look around or move without feeling boxed in. A trail, oval, garden, market or neighbourhood you haven’t explored.",
      category: "Adventure",
      closing:
        "Sometimes your body needs somewhere bigger than the room you’re in.",
    },
  },

  lonely: {
    "2": {
      title: "Send a voice message.",
      description:
        "Think of someone whose voice you would genuinely like to hear. Instead of typing, send them a quick voice message saying hello.",
      category: "Connection",
      closing: "Connection can begin very small.",
    },
    "10": {
      title: "Ask someone a real question.",
      description:
        "Message someone you like and ask something more interesting than ‘How are you?’ Try: ‘What have you been enjoying lately?’",
      category: "Connection",
      closing:
        "You don’t have to wait for someone else to start the conversation.",
    },
    "30": {
      title: "Invite someone into your day.",
      description:
        "Ask someone for a walk, coffee, browse around the shops or sit outside together. It doesn’t have to become a big plan.",
      category: "Connection",
      closing:
        "Sometimes companionship is easier when there’s something simple to do together.",
    },
    out: {
      title: "Go somewhere people are.",
      description:
        "A café, market, library, walking trail or community space. You don’t have to talk to anyone. Just let yourself be around other humans for a while.",
      category: "Connection",
      closing:
        "Being amongst people can be a first step before talking to them.",
    },
  },

  overwhelmed: {
    "2": {
      title: "Find three things moving.",
      description:
        "Look out a window or step outside. Find three things moving around you. Leaves, clouds, birds, people, shadows, anything.",
      category: "Notice",
      closing: "For two minutes, nothing else needs your attention.",
    },
    "10": {
      title: "Do one thing slowly.",
      description:
        "Make a drink, water a plant, shower, stretch or walk around the garden. Choose one ordinary thing and deliberately stop rushing it.",
      category: "Slow down",
      closing:
        "This isn’t about catching up. It’s about stepping out of the rush.",
    },
    "30": {
      title: "Make yourself temporarily unavailable.",
      description:
        "Put your phone away, find somewhere comfortable and choose one quiet thing: read, sit outside, draw, listen to music or simply lie down.",
      category: "Quiet",
      closing:
        "You are allowed to have half an hour where nobody gets anything from you.",
    },
    out: {
      title: "Change the environment.",
      description:
        "Go somewhere that asks very little of you. A garden, quiet café, library, park or somewhere with a view.",
      category: "Reset",
      closing:
        "Sometimes you don’t need to think differently. You need to be somewhere different.",
    },
  },

  bored: {
    "2": {
      title: "Do something slightly ridiculous.",
      description:
        "Draw with your non-dominant hand, balance something on your head, try a tongue twister or invent a tiny challenge for yourself.",
      category: "Play",
      closing: "Boredom often needs novelty, not productivity.",
    },
    "10": {
      title: "Make something with what you already have.",
      description:
        "Paper, pens, Lego, food, flowers, fabric, photos, anything. Give yourself ten minutes to make something with no need for it to be useful.",
      category: "Create",
      closing:
        "You are allowed to make things for absolutely no reason.",
    },
    "30": {
      title: "Try something you’re not good at.",
      description:
        "Follow a drawing tutorial, learn a dance, bake something new, make a playlist, practise a craft or try a game you haven’t played before.",
      category: "Curiosity",
      closing: "Being a beginner is allowed.",
    },
    out: {
      title: "Go somewhere you normally drive past.",
      description:
        "A shop, trail, gallery, market, park or café you’ve noticed but never entered. Today, go and have a look.",
      category: "Adventure",
      closing: "You don’t need a special occasion to explore.",
    },
  },

  good: {
    "2": {
      title: "Use the good mood.",
      description:
        "Put on a favourite song, step outside, stretch, dance or send someone a funny message. Add a little more life to the feeling that’s already there.",
      category: "Play",
      closing: "Good days deserve attention too.",
    },
    "10": {
      title: "Do something just because you want to.",
      description:
        "Read, draw, walk, sing, garden, call someone, sit in the sun or start something you’ve been curious about.",
      category: "Choice",
      closing:
        "Notice how different it feels when nobody is making you do it.",
    },
    "30": {
      title: "Follow your curiosity.",
      description:
        "Choose something you’ve been wanting to try and give yourself half an hour. No outcome required.",
      category: "Curiosity",
      closing: "Sometimes energy is an invitation.",
    },
    out: {
      title: "Make a tiny adventure.",
      description:
        "Go somewhere you haven’t been recently. Take a different route, visit a market, walk somewhere new or ask someone to come with you.",
      category: "Adventure",
      closing: "It doesn’t need to be extraordinary to feel different.",
    },
  },
};

export default function MyTurnTodayPage() {
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [time, setTime] = useState<TimeOption | null>(null);
  const [saved, setSaved] = useState(false);
  const [done, setDone] = useState(false);
  const [communityChoice, setCommunityChoice] =
    useState<CommunityChoice | null>(null);

  const suggestion = useMemo(() => {
    if (!feeling || !time) return null;
    return suggestions[feeling][time];
  }, [feeling, time]);

  const selectedCommunityChoice = communityChoices.find(
    (choice) => choice.id === communityChoice
  );

  function startAgain() {
    setFeeling(null);
    setTime(null);
    setSaved(false);
    setDone(false);
  }

  function saveForLater() {
    if (!suggestion) return;

    try {
      const existing = window.localStorage.getItem(
        "my-turn-personal-list"
      );

      const parsed = existing ? JSON.parse(existing) : [];
      const currentList = Array.isArray(parsed) ? parsed : [];

      const alreadySaved = currentList.some(
        (item: { text?: string }) => item.text === suggestion.title
      );

      if (!alreadySaved) {
        const updated = [
          {
            id: Date.now(),
            text: suggestion.title,
          },
          ...currentList,
        ];

        window.localStorage.setItem(
          "my-turn-personal-list",
          JSON.stringify(updated)
        );

        window.dispatchEvent(new Event("my-turn-list-updated"));
      }

      setSaved(true);
    } catch {
      setSaved(true);
    }
  }

  function selectCommunityChoice(choice: CommunityChoice) {
    setCommunityChoice(choice);

    try {
      window.localStorage.setItem(
        "my-turn-community-interest",
        choice
      );
    } catch {
      // Local storage is optional for the pilot.
    }
  }

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <section className="px-6 pb-14 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            My Turn Today
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-[#24373d] md:text-7xl">
            What do you need today?
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#526b75]">
            Not what should you do. Not what needs to get finished. Just what
            might help you feel a little more like yourself today.
          </p>
        </div>
      </section>

      {!feeling && (
        <section className="px-6 pb-24 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b8995]">
                First
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#24373d] md:text-4xl">
                How are you arriving today?
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feelings.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFeeling(item.id)}
                  className="group rounded-[28px] border border-white/80 bg-white/65 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  <p className="font-serif text-2xl text-[#29434d]">
                    {item.label}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#687f88]">
                    {item.description}
                  </p>

                  <p className="mt-6 text-sm font-semibold text-[#4f7887]">
                    This feels like me →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {feeling && !time && (
        <section className="px-6 pb-24 md:px-10">
          <div className="mx-auto max-w-5xl">
            <button
              type="button"
              onClick={() => setFeeling(null)}
              className="mb-8 text-sm font-semibold text-[#557985]"
            >
              ← Change how I&apos;m feeling
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b8995]">
                Now
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#24373d] md:text-4xl">
                How much space do you have?
              </h2>

              <p className="mt-4 text-[#637b84]">
                Tiny counts. You don&apos;t need an entire free afternoon.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
              {times.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTime(item.id)}
                  className="rounded-[28px] border border-white/80 bg-white/65 p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  <p className="font-serif text-2xl text-[#29434d]">
                    {item.label}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#687f88]">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {suggestion && (
        <section className="px-6 pb-24 md:px-10">
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() => setTime(null)}
              className="mb-8 text-sm font-semibold text-[#557985]"
            >
              ← Choose a different amount of time
            </button>

            <div className="overflow-hidden rounded-[36px] bg-[#fffdf8] shadow-[0_24px_70px_rgba(50,77,87,0.14)] ring-1 ring-white">
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#759aaa]">
                    Your My Turn idea
                  </p>

                  <span className="rounded-full bg-[#e7f1f4] px-4 py-2 text-xs font-semibold text-[#547985]">
                    {suggestion.category}
                  </span>
                </div>

                <h2 className="mt-7 font-serif text-4xl leading-tight text-[#24373d] md:text-5xl">
                  {suggestion.title}
                </h2>

                <p className="mt-7 text-lg leading-8 text-[#526b75]">
                  {suggestion.description}
                </p>

                <div className="mt-9 border-l-2 border-[#a9c4ce] pl-5">
                  <p className="font-serif text-xl italic leading-8 text-[#5d747d]">
                    {suggestion.closing}
                  </p>
                </div>

                {!done ? (
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setDone(true)}
                      className="rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
                    >
                      I&apos;m going to do this
                    </button>

                    <button
                      type="button"
                      onClick={saveForLater}
                      className="rounded-full bg-[#edf5f7] px-7 py-4 text-sm font-semibold text-[#456d79] transition hover:bg-[#e2eff2]"
                    >
                      {saved
                        ? "Saved to My List"
                        : "Save this to My List"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-10 rounded-[24px] bg-[#eaf3f5] p-6">
                    <p className="font-serif text-2xl text-[#29434d]">
                      That&apos;s enough for today.
                    </p>

                    <p className="mt-3 leading-7 text-[#617881]">
                      You don&apos;t need to turn it into a challenge, habit
                      or goal. Just go and have your turn.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <button
                type="button"
                onClick={startAgain}
                className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
              >
                Start again
              </button>

              <p className="max-w-xl text-sm leading-6 text-[#6b8189]">
                Come back tomorrow and your answer can be completely
                different.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white/35 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#557f91]">
              Some things really are better together
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#24373d] md:text-6xl">
              What would feel easier if someone came with you?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#526b75]">
              Maybe you already know what you enjoy. The harder part is finding
              someone to do it with.
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-[#526b75]">
              Or maybe it&apos;s been so long since you&apos;ve had time for
              yourself that you&apos;re not even sure what sounds fun anymore.
              Start with whichever of these feels closest.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communityChoices.map((choice) => {
              const selected = communityChoice === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => selectCommunityChoice(choice.id)}
                  className={[
                    "rounded-[28px] border p-6 text-left transition duration-300",
                    selected
                      ? "border-[#7ca5b2] bg-[#fffdf8] shadow-md"
                      : "border-white/80 bg-white/65 shadow-sm hover:-translate-y-1 hover:bg-white hover:shadow-md",
                  ].join(" ")}
                >
                  <p className="font-serif text-2xl text-[#29434d]">
                    {choice.title}
                  </p>

                  <p className="mt-3 leading-7 text-[#58717a]">
                    {choice.intro}
                  </p>

                  <div className="mt-5 border-t border-[#d6e2e5] pt-4">
                    <p className="text-sm leading-6 text-[#789099]">
                      {choice.examples}
                    </p>
                  </div>

                  <p className="mt-5 text-sm font-semibold text-[#4f7887]">
                    {selected
                      ? "This sounds like me"
                      : "This might be me →"}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedCommunityChoice && (
            <div className="mx-auto mt-10 max-w-3xl rounded-[32px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#759aaa]">
                Something worth noticing
              </p>

              <h3 className="mt-4 font-serif text-3xl leading-tight text-[#29434d] md:text-4xl">
                {selectedCommunityChoice.responseTitle}
              </h3>

              <p className="mt-5 text-lg leading-8 text-[#5c747d]">
                {selectedCommunityChoice.response}
              </p>

              <div className="mt-7 rounded-[22px] bg-[#eaf3f5] p-5">
                <p className="text-sm leading-7 text-[#54717b]">
                  This is exactly the sort of thing we want women to help
                  shape at My Turn. Not a timetable full of activities decided
                  for you, but a community built around what women actually
                  miss and what they&apos;d genuinely like someone to join
                  them in.
                </p>
              </div>
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <h3 className="font-serif text-3xl text-[#24373d] md:text-4xl">
              You don&apos;t need to arrive with a hobby.
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#526b75]">
              You don&apos;t have to know what your &quot;thing&quot; is.
              Sometimes you find that out by being around other people,
              hearing what they&apos;re trying and saying, &quot;Actually,
              I&apos;d come to that.&quot;
            </p>

            <p className="mx-auto mt-5 max-w-2xl font-serif text-xl italic leading-8 text-[#5b737c]">
              Maybe the first thing you need isn&apos;t a new hobby. Maybe
              it&apos;s people to discover one with.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/#founding-night"
                className="rounded-full bg-[#24373d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#314c57]"
              >
                Come to the founding session
              </Link>

              <Link
                href="/my-turn/list"
                className="rounded-full bg-white/75 px-7 py-4 text-sm font-semibold text-[#456570] ring-1 ring-white transition hover:bg-white"
              >
                Find something I&apos;d like to do
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/50 px-6 py-8 text-center text-sm text-[#607982]">
        My Turn by Never Too Old to Play · Chirnside Park, Victoria
      </footer>
    </main>
  );
}