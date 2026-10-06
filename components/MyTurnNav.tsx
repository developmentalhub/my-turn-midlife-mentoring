"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SavedIdea = {
  id: number;
  text: string;
};

const navItems = [
  {
    label: "Today",
    href: "/my-turn/today",
  },
  {
    label: "Community",
    href: "/my-turn/community",
  },
  {
    label: "My Quiet Space",
    href: "/my-turn/journal",
  },
  {
    label: "Community Wall",
    href: "/my-turn/wall",
  },
  {
    label: "My Turn List",
    href: "/my-turn/list",
  },
];

export default function MyTurnNav() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);

  function loadSavedIdeas() {
    try {
      const saved = window.localStorage.getItem(
        "my-turn-personal-list"
      );

      if (!saved) {
        setSavedIdeas([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setSavedIdeas(parsed);
      }
    } catch {
      setSavedIdeas([]);
    }
  }

  useEffect(() => {
    loadSavedIdeas();

    function handleUpdate() {
      loadSavedIdeas();
    }

    window.addEventListener(
      "my-turn-list-updated",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "my-turn-list-updated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  function isActive(href: string) {
    return pathname === href;
  }

  function removeFromList(id: number) {
    const updated = savedIdeas.filter(
      (item) => item.id !== id
    );

    setSavedIdeas(updated);

    try {
      window.localStorage.setItem(
        "my-turn-personal-list",
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event("my-turn-list-updated")
      );
    } catch {
      // Ignore storage errors.
    }
  }

  return (
    <>
      {/* TOP NAV */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-[#dfeef4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-wide text-[#24373d]"
          >
            MY TURN
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-4 py-2.5 text-sm font-medium transition",
                  isActive(item.href)
                    ? "bg-white text-[#294f5c] shadow-sm ring-1 ring-white"
                    : "text-[#58737d] hover:bg-white/55 hover:text-[#294f5c]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/#founding-night"
              className="ml-2 rounded-full bg-[#284f5d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
            >
              Join the Club
            </Link>
          </nav>

          {/* MOBILE */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileListOpen(true)}
              className="rounded-full bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#314c57] ring-1 ring-white"
            >
              My list{" "}
              {savedIdeas.length > 0
                ? `(${savedIdeas.length})`
                : ""}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-[#314c57] shadow-sm ring-1 ring-white"
              aria-label="Open My Turn menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* DESKTOP FIXED MY LIST */}
      <aside className="fixed right-0 top-[73px] z-30 hidden h-[calc(100vh-73px)] w-[320px] border-l border-white/70 bg-[#fffdf8]/95 shadow-[-12px_0_40px_rgba(36,55,61,0.08)] backdrop-blur lg:flex lg:flex-col">
        <div className="border-b border-[#e0e8ea] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7196a3]">
            My Turn
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <h2 className="font-serif text-3xl text-[#29434d]">
              My list
            </h2>

            {savedIdeas.length > 0 && (
              <span className="rounded-full bg-[#e7f1f4] px-3 py-1 text-xs font-semibold text-[#557985]">
                {savedIdeas.length}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-[#71858d]">
            Little things you&apos;d actually like to do.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {savedIdeas.length > 0 ? (
            <div className="space-y-3">
              {savedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-[20px] bg-[#edf5f7] p-4"
                >
                  <p className="font-serif text-lg leading-7 text-[#314c57]">
                    {idea.text}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromList(idea.id)
                    }
                    className="mt-3 text-xs font-semibold text-[#607982] underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-[#edf5f7] p-5 text-center">
              <p className="font-serif text-xl text-[#29434d]">
                Nothing here yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#687f88]">
                Save anything that makes you think,
                “I&apos;d like to do that.”
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#e0e8ea] p-4">
          <Link
            href="/my-turn/list"
            className="block rounded-full bg-[#284f5d] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#356b7b]"
          >
            Find more ideas
          </Link>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-[#24373d]/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* MOBILE MENU */}
      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-[88%] max-w-[380px]",
          "bg-[#fffdf8] shadow-[-20px_0_60px_rgba(36,55,61,0.18)]",
          "transition-transform duration-300 ease-out lg:hidden",
          menuOpen
            ? "translate-x-0"
            : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#e0e8ea] px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7196a3]">
                Never Too Old to Play
              </p>

              <p className="mt-1 font-serif text-3xl text-[#29434d]">
                My Turn
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5f7] text-2xl text-[#55747e]"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={[
                    "block rounded-[20px] px-5 py-4 transition",
                    isActive(item.href)
                      ? "bg-[#e7f1f4] text-[#294f5c]"
                      : "text-[#526c75] hover:bg-[#f0f6f7]",
                  ].join(" ")}
                >
                  <p className="font-serif text-xl">
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-7 border-t border-[#e1e9eb] pt-7">
              <Link
                href="/#founding-night"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="block rounded-[22px] bg-[#284f5d] px-5 py-4 text-center text-sm font-semibold text-white"
              >
                Join the Club
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* MOBILE MY LIST OVERLAY */}
      {mobileListOpen && (
        <button
          type="button"
          aria-label="Close My Turn list"
          onClick={() =>
            setMobileListOpen(false)
          }
          className="fixed inset-0 z-40 bg-[#24373d]/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* MOBILE MY LIST */}
      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-[90%] max-w-[390px]",
          "bg-[#fffdf8] shadow-[-20px_0_60px_rgba(36,55,61,0.18)]",
          "transition-transform duration-300 ease-out lg:hidden",
          mobileListOpen
            ? "translate-x-0"
            : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#e0e8ea] px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7196a3]">
                My Turn
              </p>

              <h2 className="mt-1 font-serif text-3xl text-[#29434d]">
                My list
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileListOpen(false)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5f7] text-xl text-[#55747e]"
              aria-label="Close my list"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {savedIdeas.length > 0 ? (
              <div className="space-y-3">
                {savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="rounded-[22px] bg-[#edf5f7] p-5"
                  >
                    <p className="font-serif text-xl leading-7 text-[#314c57]">
                      {idea.text}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(
                          idea.id
                        )
                      }
                      className="mt-4 text-xs font-semibold text-[#607982] underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-[#edf5f7] p-6 text-center">
                <p className="font-serif text-2xl text-[#29434d]">
                  Your list is empty.
                </p>

                <p className="mt-3 text-sm leading-6 text-[#687f88]">
                  Save anything that catches your attention.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[#e0e8ea] p-6">
            <Link
              href="/my-turn/list"
              onClick={() =>
                setMobileListOpen(false)
              }
              className="block w-full rounded-full bg-[#284f5d] px-6 py-4 text-center text-sm font-semibold text-white"
            >
              Find more ideas
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}