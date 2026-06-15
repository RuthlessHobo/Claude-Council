import { ChainIcon } from "./icons";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-brand" style={{ background: "var(--brand-10)" }}>
            <ChainIcon width={20} height={20} />
          </span>
          <span className="font-heading text-lg font-semibold tracking-[0.2em] text-text">
            STANNECT
          </span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
