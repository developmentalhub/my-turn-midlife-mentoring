import Link from "next/link";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#dfeef4] text-[#24373d]">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-[#dfeef4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-serif text-xl font-semibold tracking-wide text-[#24373d]"
            >
              MY TURN
            </Link>

            <span className="hidden rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7196a3] sm:inline">
              Admin
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-end gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-[#58737d] transition hover:bg-white/60 hover:text-[#294f5c]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/#founding-night"
              className="ml-1 rounded-full bg-[#284f5d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#356b7b]"
            >
              Join the Club
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}