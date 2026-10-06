"use client";

import {
  FormEvent,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import MyTurnJourney from "../components/MyTurnJourney";
import MyTurnNav from "../components/MyTurnNav";
import { supabase } from "../lib/supabase";

const notes = [
  {
    src: "/notes/note-1.png",
    alt: "Handwritten note about childhood play memories",
  },
  {
    src: "/notes/note-2.png",
    alt: "Handwritten note about childhood play memories",
  },
  {
    src: "/notes/note-3.jpg",
    alt: "Handwritten note about childhood play memories",
  },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const times = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Saturday mornings",
  "Saturday afternoons",
  "Sunday mornings",
  "Sunday afternoons",
];

const betweenSessionOptions = [
  "Browse ideas when I feel stuck",
  "Use My Quiet Space for myself",
  "Save things I want to try",
  "Join online conversations",
  "Get little prompts or challenges",
  "Connect with other women",
  "Hear about local outings or activities",
  "I’m not sure yet",
];

const interests = [
  "Conversation and connection",
  "Creative things",
  "Walking and getting outside",
  "Movement that feels fun",
  "Books and interesting discussions",
  "Games and play",
  "Trying new things",
  "Local outings and adventures",
  "Guest speakers",
  "Learning new skills",
  "Quiet time and wellbeing",
  "Just having people to hang out with",
];

export default function HomePage() {
  const [firstName, setFirstName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [suburb, setSuburb] =
    useState("");

  const [ageRange, setAgeRange] =
    useState("");

  const [
    preferredDays,
    setPreferredDays,
  ] = useState<string[]>([]);

  const [
    preferredTimes,
    setPreferredTimes,
  ] = useState<string[]>([]);

  const [
    betweenSessions,
    setBetweenSessions,
  ] = useState<string[]>([]);

  const [
    selectedInterests,
    setSelectedInterests,
  ] = useState<string[]>([]);

  const [
    bringSomeone,
    setBringSomeone,
  ] = useState("");

  const [
    childhoodPlay,
    setChildhoodPlay,
  ] = useState("");

  const [miss, setMiss] =
    useState("");

  const [
    tryTogether,
    setTryTogether,
  ] = useState("");

  const [barrier, setBarrier] =
    useState("");

  const [hope, setHope] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    registered,
    setRegistered,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  function toggleArrayValue(
    value: string,
    current: string[],
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) {
    setter(
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value]
    );
  }

  async function submitRegistration(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !firstName.trim() ||
      !email.trim()
    ) {
      setMessage(
        "Please add your first name and email."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase
      .from("my_turn_registrations")
      .insert({
        first_name:
          firstName.trim(),

        email:
          email.trim(),

        suburb:
          suburb.trim() || null,

        age_range:
          ageRange || null,

        preferred_days:
          preferredDays,

        preferred_times:
          preferredTimes,

        between_sessions:
          betweenSessions,

        interests:
          selectedInterests,

        bring_someone:
          bringSomeone || null,

        childhood_play:
          childhoodPlay.trim() ||
          null,

        miss_now:
          miss.trim() || null,

        try_together:
          tryTogether.trim() ||
          null,

        barrier:
          barrier.trim() || null,

        hope:
          hope.trim() || null,
      });

    setSubmitting(false);

    if (error) {
      console.error(
        "Supabase registration error:",
        error
      );

      setMessage(
        "Something went wrong while saving your registration. Please try again."
      );

      return;
    }

    setRegistered(true);

    window.scrollTo({
      top:
        document
          .getElementById(
            "register"
          )
          ?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <MyTurnNav />

      <main className="overflow-hidden lg:pr-[320px]">
        {/* HERO */}
        <section className="relative px-6 py-14 md:px-10 lg:flex lg:min-h-[90vh] lg:items-center">
          <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/30 blur-3xl" />

          <div className="pointer-events-none absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-[#c9dde7]/60 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
            <div className="lg:pt-12">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#557f91]">
                Never Too Old to Play
                presents
              </p>

              <h1 className="text-6xl font-semibold tracking-[-0.05em] text-[#1c2c43] md:text-7xl lg:text-8xl">
                My Turn
              </h1>

              <p className="mt-4 text-2xl font-semibold text-[#405d75] md:text-3xl">
                It&apos;s my turn now.
              </p>

              <p className="mt-8 max-w-xl text-lg leading-8 text-[#46657b]">
                A place for women who
                want more connection,
                more play, more curiosity
                and a little more space
                to remember who they
                were before life became
                so busy.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#founding-night"
                  className="inline-flex items-center justify-center rounded-full bg-[#1c2c43] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#293d58]"
                >
                  Join the founding
                  session
                </a>

                <a
                  href="#story"
                  className="inline-flex items-center justify-center rounded-full bg-white/75 px-7 py-4 text-base font-semibold text-[#1c2c43] ring-1 ring-white transition hover:bg-white"
                >
                  Take the journey
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/my-turn/today"
                  className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
                >
                  What do I need today?
                </Link>

                <Link
                  href="/my-turn/journal"
                  className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
                >
                  My Quiet Space
                </Link>

                <Link
                  href="/my-turn/wall"
                  className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
                >
                  Community Wall
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <MyTurnJourney />
            </div>
          </div>
        </section>

        {/* STORY */}
        <section
          id="story"
          className="relative overflow-hidden bg-white/30 px-6 py-20 md:px-10 md:py-28"
        >
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[340px] opacity-30 md:block">
            <Image
              src="/images/midlife-mentoring-birds.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#557f91]">
              Somewhere along the way
            </p>

            <h2 className="mt-5 font-serif text-4xl tracking-tight text-[#24373d] md:text-6xl">
              We got very good at taking
              care of everything else.
            </h2>

            <div className="mx-auto mt-8 max-w-2xl space-y-5 text-lg leading-8 text-[#526b75]">
              <p>
                Work. Family.
                Appointments. Shopping.
                Messages. Plans. Other
                people&apos;s needs.
              </p>

              <p>
                And sometimes the parts
                of us that loved to
                explore, make, move,
                laugh, read, wander,
                create and play became
                quieter.
              </p>

              <p className="font-medium text-[#24373d]">
                My Turn is an invitation
                to hear them again.
              </p>
            </div>
          </div>
        </section>

        {/* HANDWRITTEN STORIES */}
        <section className="bg-[#edf6f9] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#557f91]">
                We started asking women
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#24373d] md:text-5xl">
                What did you love before
                life got so busy?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#526b75]">
                The answers were simple,
                personal and surprisingly
                powerful.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {notes.map(
                (note, index) => (
                  <div
                    key={note.src}
                    className="flex min-h-[360px] items-center justify-center rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/60"
                  >
                    <div className="relative h-[320px] w-full">
                      <Image
                        src={note.src}
                        alt={note.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain"
                        priority={
                          index === 0
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mx-auto mt-14 max-w-3xl text-center">
              <p className="font-serif text-2xl leading-9 text-[#314c57]">
                Climbing trees. Making
                things. Reading. Roller
                skating. Riding bikes.
                Making forts. Playing
                outside until dinner.
              </p>

              <p className="mt-6 text-lg leading-8 text-[#526b75]">
                Not because any of it was
                productive.
              </p>

              <p className="mt-2 text-lg font-semibold text-[#24373d]">
                Because it felt good to
                be alive.
              </p>

              <Link
                href="/my-turn/wall"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#456873] shadow-sm ring-1 ring-white"
              >
                Explore the Community
                Wall
              </Link>
            </div>
          </div>
        </section>

        {/* WHAT THIS IS */}
        <section className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#557f91]">
                What is My Turn?
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#24373d] md:text-5xl">
                Not another
                self-improvement project.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-[#526b75]">
              <p>
                You don&apos;t need
                another list of things
                you should be doing.
              </p>

              <p>
                My Turn is about
                connection, play,
                movement, books,
                creativity, conversation
                and trying things simply
                because they make life
                feel a little more
                interesting again.
              </p>

              <p>
                We&apos;ll meet in
                Chirnside Park once a
                month, with this online
                space here whenever you
                want ideas, reflection,
                connection or a little
                nudge to do something for
                yourself.
              </p>

              <p className="font-medium text-[#24373d]">
                You don&apos;t need to
                arrive confident,
                energetic or knowing
                exactly what you need.
              </p>
            </div>
          </div>
        </section>

        {/* IDENTIFICATION */}
        <section className="relative overflow-hidden bg-white/35 px-6 py-20 md:px-10 md:py-28">
          <div className="absolute inset-y-0 left-0 hidden w-[260px] opacity-20 lg:block">
            <Image
              src="/images/midlife-mentoring-wildflowers.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#557f91]">
                Maybe this feels
                familiar
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#24373d] md:text-5xl">
                A part of you has gone a
                little quiet.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "The playful me",
                "The adventurous me",
                "The creative me",
                "The social me",
                "The curious me",
                "The peaceful me",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.75rem] bg-white/80 px-6 py-7 text-center font-serif text-xl text-[#405d68] shadow-sm ring-1 ring-white"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-lg leading-8 text-[#526b75]">
              You don&apos;t need to
              become a different person.
              Maybe you just need
              somewhere to find a little
              more of yourself again.
            </p>
          </div>
        </section>

        {/* FOUNDING SESSION */}
        <section
          id="founding-night"
          className="px-6 py-20 md:px-10 md:py-28"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#24373d] text-white shadow-xl">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="px-7 py-12 md:px-14 md:py-16">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b5cbd3]">
                  You&apos;re invited
                </p>

                <h2 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight md:text-5xl">
                  Come help us create the
                  kind of midlife club
                  you wish existed.
                </h2>

                <p className="mt-7 max-w-3xl text-lg leading-8 text-[#d6e2e5]">
                  We&apos;re opening the
                  doors at Never Too Old
                  to Play in Chirnside
                  Park for a free
                  founding session.
                </p>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-[#d6e2e5]">
                  We&apos;ll talk,
                  laugh, remember some of
                  the things we used to
                  enjoy, try something
                  playful and begin
                  shaping what My Turn
                  could become for local
                  women.
                </p>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-[#d6e2e5]">
                  After that, My Turn will
                  meet in person once a
                  month in Chirnside Park,
                  with the online
                  community here whenever
                  you want it.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-white/10 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b5cbd3]">
                      Expect
                    </p>

                    <p className="mt-3 text-lg leading-8">
                      Conversation,
                      connection, a little
                      movement, something
                      playful and
                      absolutely no
                      pressure to have
                      your life sorted.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-white/10 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b5cbd3]">
                      Bring
                    </p>

                    <p className="mt-3 text-lg leading-8">
                      Yourself.
                      Comfortable clothes.
                      Curiosity.
                      That&apos;s enough.
                    </p>
                  </div>
                </div>

                <a
                  href="#register"
                  className="mt-10 inline-flex rounded-full bg-white px-7 py-4 text-base font-semibold text-[#24373d] transition hover:bg-[#edf6f9]"
                >
                  I&apos;d like to be
                  part of it
                </a>
              </div>

              <div className="relative min-h-[360px] lg:min-h-full">
                <Image
                  src="/images/midlife-mentoring-nature-walk-portrait.png"
                  alt="Soft watercolour nature path"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* REGISTRATION */}
        <section
          id="register"
          className="bg-[#edf6f9] px-6 py-20 md:px-10 md:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#557f91]">
                Founding session
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#24373d] md:text-5xl">
                Help us build this with
                you.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#526b75]">
                Tell us a little about
                you, when you could
                realistically come and
                what would make My Turn
                worth leaving the house
                for.
              </p>
            </div>

            {registered ? (
              <div className="mt-12 rounded-[2rem] bg-white/90 p-8 text-center shadow-sm ring-1 ring-slate-200/60 md:p-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4f0f2] text-2xl text-[#365f6d]">
                  ✓
                </div>

                <h3 className="mt-6 font-serif text-3xl text-[#24373d]">
                  Thanks, {firstName}.
                </h3>

                <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#607982]">
                  You&apos;re on our
                  Founding Session list.
                  Your answers will help
                  us shape the first My
                  Turn sessions around
                  what women actually
                  want.
                </p>
              </div>
            ) : (
              <form
                onSubmit={
                  submitRegistration
                }
                className="mt-12 space-y-9 rounded-[2rem] bg-white/90 p-7 shadow-sm ring-1 ring-slate-200/60 md:p-10"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7196a3]">
                    A little about you
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-[#314c57]"
                      >
                        First name
                      </label>

                      <input
                        id="name"
                        type="text"
                        value={firstName}
                        onChange={(
                          event
                        ) =>
                          setFirstName(
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                        placeholder="Your first name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-[#314c57]"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(
                          event
                        ) =>
                          setEmail(
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="suburb"
                        className="text-sm font-semibold text-[#314c57]"
                      >
                        Suburb
                      </label>

                      <input
                        id="suburb"
                        type="text"
                        value={suburb}
                        onChange={(
                          event
                        ) =>
                          setSuburb(
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                        placeholder="Your suburb"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ageRange"
                        className="text-sm font-semibold text-[#314c57]"
                      >
                        Age range
                      </label>

                      <select
                        id="ageRange"
                        value={ageRange}
                        onChange={(
                          event
                        ) =>
                          setAgeRange(
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      >
                        <option value="">
                          Choose one
                        </option>

                        <option value="35-44">
                          35–44
                        </option>

                        <option value="45-54">
                          45–54
                        </option>

                        <option value="55-64">
                          55–64
                        </option>

                        <option value="65+">
                          65+
                        </option>

                        <option value="prefer-not">
                          Prefer not to
                          say
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e2eaec] pt-8">
                  <p className="font-serif text-2xl text-[#29434d]">
                    When could you
                    realistically come
                    to our monthly
                    Chirnside Park
                    catch-up?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#71858d]">
                    Choose as many as
                    work for you.
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {days.map(
                      (day) => {
                        const selected =
                          preferredDays.includes(
                            day
                          );

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() =>
                              toggleArrayValue(
                                day,
                                preferredDays,
                                setPreferredDays
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
                            {selected
                              ? "✓ "
                              : ""}
                            {day}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <p className="mt-7 text-sm font-semibold text-[#314c57]">
                    What times would
                    usually suit you?
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {times.map(
                      (time) => {
                        const selected =
                          preferredTimes.includes(
                            time
                          );

                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              toggleArrayValue(
                                time,
                                preferredTimes,
                                setPreferredTimes
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
                            {selected
                              ? "✓ "
                              : ""}
                            {time}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* BETWEEN MONTHLY SESSIONS */}
                <div className="border-t border-[#e2eaec] pt-8">
                  <p className="font-serif text-2xl text-[#29434d]">
                    Between our monthly
                    Chirnside Park
                    catch-ups, how would
                    you most like to use
                    My Turn?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#71858d]">
                    Choose anything that
                    sounds useful to you.
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {betweenSessionOptions.map(
                      (item) => {
                        const selected =
                          betweenSessions.includes(
                            item
                          );

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              toggleArrayValue(
                                item,
                                betweenSessions,
                                setBetweenSessions
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
                            {selected
                              ? "✓ "
                              : ""}
                            {item}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="border-t border-[#e2eaec] pt-8">
                  <p className="font-serif text-2xl text-[#29434d]">
                    What would you
                    genuinely like My
                    Turn to include?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#71858d]">
                    Pick anything that
                    makes you think,
                    “I&apos;d come to
                    that.”
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {interests.map(
                      (item) => {
                        const selected =
                          selectedInterests.includes(
                            item
                          );

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              toggleArrayValue(
                                item,
                                selectedInterests,
                                setSelectedInterests
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
                            {selected
                              ? "✓ "
                              : ""}
                            {item}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="border-t border-[#e2eaec] pt-8">
                  <p className="font-serif text-2xl text-[#29434d]">
                    How would you feel
                    about coming?
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {[
                      "Happy to come on my own",
                      "I’d probably bring a friend",
                      "I’d feel nervous coming alone",
                      "It depends on the activity",
                    ].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setBringSomeone(
                              item
                            )
                          }
                          className={[
                            "rounded-[18px] border px-4 py-3 text-left text-sm font-medium transition",
                            bringSomeone ===
                            item
                              ? "border-[#719ba8] bg-[#e8f2f4] text-[#365c68]"
                              : "border-[#e0e7e9] bg-white text-[#617981] hover:bg-[#f5f9fa]",
                          ].join(
                            " "
                          )}
                        >
                          {bringSomeone ===
                          item
                            ? "✓ "
                            : ""}
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-6 border-t border-[#e2eaec] pt-8">
                  <div>
                    <label
                      htmlFor="childhood-play"
                      className="font-serif text-2xl text-[#29434d]"
                    >
                      What did you love
                      doing for fun when
                      you were younger?
                    </label>

                    <textarea
                      id="childhood-play"
                      value={
                        childhoodPlay
                      }
                      onChange={(
                        event
                      ) =>
                        setChildhoodPlay(
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      placeholder="Whatever comes to mind first..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="miss"
                      className="font-serif text-2xl text-[#29434d]"
                    >
                      What do you miss
                      doing now?
                    </label>

                    <textarea
                      id="miss"
                      value={miss}
                      onChange={(
                        event
                      ) =>
                        setMiss(
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      placeholder="It can be something really small."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tryTogether"
                      className="font-serif text-2xl text-[#29434d]"
                    >
                      What would you love
                      to try if you had
                      people to do it
                      with?
                    </label>

                    <textarea
                      id="tryTogether"
                      value={tryTogether}
                      onChange={(
                        event
                      ) =>
                        setTryTogether(
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      placeholder="Something you keep thinking about..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="barrier"
                      className="font-serif text-2xl text-[#29434d]"
                    >
                      What usually gets
                      in the way of doing
                      things for
                      yourself?
                    </label>

                    <textarea
                      id="barrier"
                      value={barrier}
                      onChange={(
                        event
                      ) =>
                        setBarrier(
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      placeholder="Time, energy, family, not knowing who to go with..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hope"
                      className="font-serif text-2xl text-[#29434d]"
                    >
                      If My Turn became
                      something you
                      genuinely looked
                      forward to, what
                      would you hope
                      happened there?
                    </label>

                    <textarea
                      id="hope"
                      value={hope}
                      onChange={(
                        event
                      ) =>
                        setHope(
                          event.target
                            .value
                        )
                      }
                      rows={4}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-[#7198a8]"
                      placeholder="What would make you think, ‘Yes, this is for me’?"
                    />
                  </div>
                </div>

                {message && (
                  <p className="rounded-[18px] bg-[#f4ece8] px-4 py-3 text-sm text-[#775b50]">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#24373d] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#314c57] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving your place..."
                    : "I'd like to be part of My Turn"}
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your answers are used
                  to help us plan My Turn
                  and contact you about
                  the Founding Session.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ENDING */}
        <section className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] opacity-20">
            <Image
              src="/images/midlife-mentoring-open-sky.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <p className="font-serif text-4xl tracking-tight text-[#24373d] md:text-6xl">
              You&apos;re not too old.
            </p>

            <p className="mt-3 font-serif text-4xl tracking-tight text-[#607982] md:text-6xl">
              You&apos;re not too late.
            </p>

            <p className="mt-8 text-xl leading-8 text-[#526b75]">
              Maybe it&apos;s simply
              your turn.
            </p>

            <a
              href="#register"
              className="mt-9 inline-flex rounded-full bg-[#24373d] px-7 py-4 text-base font-semibold text-white transition hover:bg-[#314c57]"
            >
              It&apos;s my turn now
            </a>
          </div>
        </section>

        <footer className="border-t border-white/50 px-6 py-8 text-center text-sm text-[#607982]">
          My Turn by Never Too Old to Play
          · Chirnside Park, Victoria
        </footer>
      </main>
    </div>
  );
}