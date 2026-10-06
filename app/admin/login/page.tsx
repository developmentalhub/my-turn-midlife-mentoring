"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to sign in."
        );

        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Unable to sign in."
      );

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfeef4] px-6 py-12 text-[#24373d]">
      <div className="w-full max-w-md rounded-[32px] bg-[#fffdf8] p-8 shadow-xl ring-1 ring-white md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7196a3]">
          My Turn
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#29434d]">
          Admin
        </h1>

        <p className="mt-4 leading-7 text-[#617981]">
          Sign in to manage the My
          Turn community.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <label
            htmlFor="adminPassword"
            className="text-sm font-semibold text-[#405f69]"
          >
            Admin password
          </label>

          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            className="mt-2 w-full rounded-[20px] border border-[#d9e3e6] bg-white px-4 py-4 text-[#314c57] outline-none transition focus:border-[#759ca9]"
          />

          {error && (
            <p className="mt-4 rounded-[18px] bg-[#f4ece8] px-4 py-3 text-sm text-[#775b50]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#284f5d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#356b7b] disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Open admin"}
          </button>
        </form>
      </div>
    </main>
  );
}