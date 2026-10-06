"use client";

import { ChangeEvent, useEffect, useState } from "react";

type WallEntry = {
  id: number;
  cardNumber: string;
  question: string;
  answer: string;
  image?: string;
};

const cards = [
  {
    number: "01",
    eyebrow: "Remember",
    question: "What did you love doing before life got so busy?",
    body:
      "Think back further than last year. What did you naturally choose when the afternoon was yours?",
    prompt: "Don’t search for the sensible answer.",
    placeholder:
      "Maybe it was riding your bike, making mud pies, reading for hours...",
  },
  {
    number: "02",
    eyebrow: "Go deeper",
    question: "What made you completely forget the time?",
    body:
      "Not what you were good at. Not what was productive. What could you disappear into simply because you loved it?",
    prompt: "Notice what comes back to you.",
    placeholder:
      "What could you happily lose an entire afternoon doing?",
  },
  {
    number: "03",
    eyebrow: "Hold onto it",
    question: "What is something you would love to bring back?",
    body:
      "It doesn’t have to look exactly the way it did when you were young. What part of that feeling would you like more of now?",
    prompt: "Maybe this is where your turn begins.",
    placeholder:
      "I would love to start doing...",
  },
];

export default function MyTurnJourney() {
  const [activeCard, setActiveCard] = useState(0);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const [answers, setAnswers] = useState(["", "", ""]);
  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [uploadedNames, setUploadedNames] = useState(["", "", ""]);

  const [wallEntries, setWallEntries] = useState<WallEntry[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("my-turn-community-wall");

      if (saved) {
        setWallEntries(JSON.parse(saved));
      }
    } catch {
      // Ignore local storage errors.
    }
  }, []);

  function getCardPosition(index: number) {
    const difference = (index - activeCard + cards.length) % cards.length;

    if (difference === 0) {
      return {
        transform: "translate(-50%, 0px) rotate(0deg) scale(1)",
        zIndex: 30,
        opacity: 1,
      };
    }

    if (difference === 1) {
      return {
        transform:
          "translate(calc(-50% + 112px), 28px) rotate(7deg) scale(0.94)",
        zIndex: 20,
        opacity: 0.98,
      };
    }

    return {
      transform:
        "translate(calc(-50% - 112px), 28px) rotate(-7deg) scale(0.94)",
      zIndex: 10,
      opacity: 0.98,
    };
  }

  function bringCardForward(index: number) {
    if (index !== activeCard) {
      setActiveCard(index);
      setFlippedCard(null);
      setMessage("");
      return;
    }

    setFlippedCard(index);
    setMessage("");
  }

  function updateAnswer(index: number, value: string) {
    setAnswers((current) =>
      current.map((answer, answerIndex) =>
        answerIndex === index ? value : answer
      )
    );
  }

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage(
        "Please choose an image smaller than 2 MB for this pilot version."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;

      setUploadedImages((current) =>
        current.map((image, imageIndex) =>
          imageIndex === index ? result : image
        )
      );

      setUploadedNames((current) =>
        current.map((name, nameIndex) =>
          nameIndex === index ? file.name : name
        )
      );

      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  function removeImage(index: number) {
    setUploadedImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? null : image
      )
    );

    setUploadedNames((current) =>
      current.map((name, nameIndex) => (nameIndex === index ? "" : name))
    );
  }

  function addToWall(index: number) {
    const answer = answers[index].trim();
    const image = uploadedImages[index];

    if (!answer && !image) {
      setMessage(
        "Write an answer or upload your handwritten answer first."
      );
      return;
    }

    const newEntry: WallEntry = {
      id: Date.now(),
      cardNumber: cards[index].number,
      question: cards[index].question,
      answer,
      image: image ?? undefined,
    };

    const updatedEntries = [newEntry, ...wallEntries];

    setWallEntries(updatedEntries);

    try {
      window.localStorage.setItem(
        "my-turn-community-wall",
        JSON.stringify(updatedEntries)
      );
    } catch {
      // Ignore local storage errors.
    }

    setMessage("Your memory has been added to your My Turn wall.");

    setAnswers((current) =>
      current.map((answerValue, answerIndex) =>
        answerIndex === index ? "" : answerValue
      )
    );

    setUploadedImages((current) =>
      current.map((imageValue, imageIndex) =>
        imageIndex === index ? null : imageValue
      )
    );

    setUploadedNames((current) =>
      current.map((nameValue, nameIndex) =>
        nameIndex === index ? "" : nameValue
      )
    );
  }

  return (
    <div className="w-full">
      <div className="mb-5 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
          A question for you
        </p>

        <p className="mt-2 text-sm text-[#617982]">
          Choose a card. Then click it again to answer.
        </p>
      </div>

      <div className="relative mx-auto h-[470px] w-full max-w-[680px] lg:mx-0">
        {cards.map((card, index) => {
          const isActive = activeCard === index;
          const isFlipped = flippedCard === index;

          return (
            <div
              key={card.number}
              className="absolute left-1/2 top-0 h-[410px] w-[72%] min-w-[285px] max-w-[440px] transition-all duration-500 ease-out"
              style={getCardPosition(index)}
            >
              <div
                className="relative h-full w-full transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
              >
                {/* FRONT */}
                <button
                  type="button"
                  onClick={() => bringCardForward(index)}
                  aria-label={
                    isActive
                      ? `Answer ${card.question}`
                      : `Bring ${card.eyebrow} card forward`
                  }
                  className="absolute inset-0 h-full w-full overflow-hidden rounded-[30px] border border-white/90 bg-[#fffdf8] text-left shadow-[0_22px_55px_rgba(46,69,78,0.18)] transition-shadow hover:shadow-[0_28px_65px_rgba(46,69,78,0.23)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6e9bab]/30"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="flex h-full flex-col px-7 py-8 md:px-9 md:py-9">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7198a8]">
                        {card.eyebrow}
                      </p>

                      <span className="font-serif text-sm italic text-[#9aadb4]">
                        {card.number}
                      </span>
                    </div>

                    <h3 className="mt-7 max-w-[340px] font-serif text-[27px] leading-[1.08] text-[#172d34] md:text-[34px]">
                      {card.question}
                    </h3>

                    <p className="mt-6 max-w-[350px] text-[15px] leading-7 text-[#536a72]">
                      {card.body}
                    </p>

                    <div className="mt-auto border-t border-[#dce4e5] pt-5">
                      <p className="font-serif text-[15px] italic leading-6 text-[#71858b]">
                        {card.prompt}
                      </p>

                      {isActive && (
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b7988]">
                          Click again to answer →
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* BACK */}
                <div
                  className="absolute inset-0 h-full w-full overflow-hidden rounded-[30px] border border-white/90 bg-[#fffdf8] shadow-[0_22px_55px_rgba(46,69,78,0.18)]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex h-full flex-col px-6 py-6 md:px-8 md:py-7">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7198a8]">
                          Your turn
                        </p>

                        <p className="mt-1 text-sm text-[#617982]">
                          Share it in your own way.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFlippedCard(null)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e2e5] bg-white text-lg text-[#54727d] transition hover:bg-[#edf5f7]"
                        aria-label="Flip back to the question"
                      >
                        ↺
                      </button>
                    </div>

                    <textarea
                      value={answers[index]}
                      onChange={(event) =>
                        updateAnswer(index, event.target.value)
                      }
                      rows={4}
                      placeholder={card.placeholder}
                      className="mt-5 w-full flex-1 resize-none rounded-[18px] border border-[#d7e2e5] bg-white/80 px-4 py-3 text-[15px] leading-6 text-[#314c57] outline-none transition placeholder:text-[#9aabb0] focus:border-[#7198a8]"
                    />

                    <div className="mt-4">
                      {!uploadedImages[index] ? (
                        <label className="flex cursor-pointer items-center justify-center rounded-full border border-[#bfd0d6] bg-[#eef6f8] px-4 py-3 text-sm font-semibold text-[#456d79] transition hover:bg-[#e3f0f3]">
                          Upload my handwritten answer
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleImageUpload(event, index)
                            }
                          />
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 rounded-[16px] border border-[#d7e2e5] bg-white p-2.5">
                          <img
                            src={uploadedImages[index] ?? ""}
                            alt="Preview of uploaded handwritten answer"
                            className="h-14 w-14 rounded-xl object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[#45616b]">
                              {uploadedNames[index]}
                            </p>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="mt-1 text-xs font-semibold text-[#6b858d] underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToWall(index)}
                      className="mt-4 w-full rounded-full bg-[#284f5d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
                    >
                      Add mine to the community wall
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="-mt-5 flex justify-center gap-2 lg:justify-start">
        {cards.map((card, index) => (
          <button
            key={card.number}
            type="button"
            onClick={() => {
              setActiveCard(index);
              setFlippedCard(null);
              setMessage("");
            }}
            aria-label={`Show card ${index + 1}`}
            className={[
              "h-2.5 rounded-full transition-all duration-300",
              activeCard === index
                ? "w-8 bg-[#356b7b]"
                : "w-2.5 bg-[#aac2ca] hover:bg-[#7e9faa]",
            ].join(" ")}
          />
        ))}
      </div>

      {message && (
        <p className="mt-5 text-center text-sm font-medium text-[#456d79] lg:text-left">
          {message}
        </p>
      )}

      {wallEntries.length > 0 && (
        <div className="mt-10">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#557f91]">
                Community wall
              </p>

              <p className="mt-2 font-serif text-2xl text-[#24373d]">
                What women are remembering
              </p>
            </div>

            <span className="text-xs text-[#71858b]">
              Pilot preview
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {wallEntries.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="rounded-[22px] bg-white/70 p-4 shadow-sm ring-1 ring-white/80"
              >
                {entry.image && (
                  <img
                    src={entry.image}
                    alt="Uploaded handwritten childhood memory"
                    className="mb-4 max-h-48 w-full rounded-[16px] object-contain bg-white"
                  />
                )}

                {entry.answer && (
                  <p className="font-serif text-lg italic leading-7 text-[#314c57]">
                    “{entry.answer}”
                  </p>
                )}

                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#80969d]">
                  My Turn memory
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-[#71858b]">
            For this pilot build, answers are saved only in this browser.
            When we connect the live community wall, submissions can be shared
            across visitors after approval.
          </p>
        </div>
      )}
    </div>
  );
}