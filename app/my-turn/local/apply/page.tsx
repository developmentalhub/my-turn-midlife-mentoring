"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

export default function MyTurnLocalApplyPage() {
  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    imageName,
    setImageName,
  ] = useState("");

  function handleImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setImageName(
      file?.name ?? ""
    );
  }

  async function submitApplication(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");

    try {
      const form =
        event.currentTarget;

      const formData =
        new FormData(form);

      const response =
        await fetch(
          "/api/local-business-application",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong. Please try again."
        );
        return;
      }

      setSubmitted(true);
      form.reset();
      setImageName("");
    } catch (error) {
      console.error(
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#dfeef4] px-6 py-20 text-[#24373d] md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[40px] bg-[#fffdf8] p-8 text-center shadow-sm ring-1 ring-white md:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
              My Turn Local
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Thank you for sharing
              your story.
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#5b737c]">
              Your application has
              been sent through for
              review. Nothing will
              appear publicly until
              we&apos;ve looked over
              it first.
            </p>

            <Link
              href="/my-turn/local"
              className="mt-9 inline-flex rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white"
            >
              Back to My Turn Local
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <section className="relative overflow-hidden px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <div className="absolute inset-0">
          <img
            src="/my-turn-local/my-turn-local-cta.png"
            alt=""
            className="h-full w-full object-cover opacity-80"
          />

          <div className="absolute inset-0 bg-[#dfeef4]/55" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#557f91]">
            Become part of My Turn Local
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
            Tell us the story
            behind your business.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#526b75]">
            We&apos;re creating
            something more personal
            than a traditional
            directory. We want women
            to meet the people behind
            the places in their local
            community.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <form
          onSubmit={
            submitApplication
          }
          className="mx-auto max-w-4xl space-y-10 rounded-[40px] bg-[#fffdf8] p-7 shadow-sm ring-1 ring-white md:p-12"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
              The basics
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#29434d]">
              Tell us who you are.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Business name"
              name="businessName"
              required
            />

            <Field
              label="Your name"
              name="contactName"
              required
            />

            <Field
              label="Email"
              name="email"
              type="email"
              required
            />

            <Field
              label="Phone"
              name="phone"
            />

            <Field
              label="Suburb"
              name="suburb"
              required
            />

            <Field
              label="Website"
              name="website"
              placeholder="https://..."
            />

            <Field
              label="Instagram"
              name="instagram"
              placeholder="https://..."
            />

            <Field
              label="Facebook"
              name="facebook"
              placeholder="https://..."
            />
          </div>

          <div className="border-t border-[#e2e9eb] pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
              Your business
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#29434d]">
              Help us understand
              what makes it yours.
            </h2>

            <div className="mt-8 space-y-8">
              <TextArea
                label="In one sentence, what does your business actually offer?"
                name="oneSentence"
                placeholder="Keep this simple and conversational."
                required
              />

              <TextArea
                label="What inspired you to start your business?"
                name="inspiration"
                placeholder="Tell us the real story."
                required
              />

              <TextArea
                label="What part of your business do you still genuinely love?"
                name="loveAboutBusiness"
                placeholder="What still lights you up?"
                required
              />
            </div>
          </div>

          <div className="border-t border-[#e2e9eb] pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
              Sprinkle in a little My Turn
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#29434d]">
              How could your
              business help a woman
              choose herself?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#617981]">
              This doesn&apos;t need
              to be complicated. It
              could be permission to
              slow down, try
              something new, be a
              beginner, connect with
              someone or simply do
              something because she
              enjoys it.
            </p>

            <div className="mt-8 space-y-8">
              <TextArea
                label="How does your business already sprinkle a little My Turn into what you do?"
                name="sprinkleMyTurn"
                placeholder="Tell us how women feel when they spend time with you."
                required
              />

              <TextArea
                label="What gentle invitation would you give a woman reading your profile?"
                name="gentleInvitation"
                placeholder="Come in, try something, stay a while..."
                required
              />
            </div>
          </div>

          <div className="border-t border-[#e2e9eb] pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
              Show us your business
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#29434d]">
              Add a photo.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#617981]">
              Choose a photo that
              gives women a feel for
              your business, service,
              space or what you
              create.
            </p>

            <label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-[26px] border border-dashed border-[#aac1c9] bg-[#eef6f7] px-6 py-9 text-center">
              <span className="font-semibold text-[#527581]">
                Choose a business
                photo
              </span>

              <span className="mt-2 text-sm text-[#7a929a]">
                JPG, PNG or WEBP,
                up to 5 MB
              </span>

              {imageName && (
                <span className="mt-4 text-sm font-medium text-[#405f69]">
                  {imageName}
                </span>
              )}

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImage
                }
                className="hidden"
              />
            </label>
          </div>

          {message && (
            <p className="rounded-[20px] bg-[#f4ece8] px-5 py-4 text-sm text-[#775b50]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#284f5d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Sending your application..."
              : "Apply to join My Turn Local"}
          </button>

          <p className="text-center text-sm leading-6 text-[#7a8f96]">
            Applications are reviewed
            before anything is added
            publicly to My Turn Local.
          </p>
        </form>
      </section>

      <section className="bg-[#fffdf8] px-6 py-10 text-center">
        <Link
          href="/my-turn/local"
          className="text-sm font-semibold text-[#557985] underline decoration-[#9cb7c1] underline-offset-4"
        >
          ← Back to My Turn Local
        </Link>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-[#405f69]"
      >
        {label}
        {required && " *"}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-[20px] border border-[#d9e3e6] bg-white px-4 py-4 text-base text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-[#405f69]"
      >
        {label}
        {required && " *"}
      </label>

      <textarea
        id={name}
        name={name}
        required={required}
        rows={5}
        maxLength={1800}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-[22px] border border-[#d9e3e6] bg-white px-4 py-4 text-base leading-7 text-[#314c57] outline-none transition placeholder:text-[#9eafb4] focus:border-[#759ca9]"
      />
    </div>
  );
}