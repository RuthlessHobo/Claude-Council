import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ConnectedGrid from "@/components/ConnectedGrid";

export default function Home() {
  return (
    <main id="top" className="bg-warm-field min-h-screen">
      <Header />
      <Hero />
      <div id="workspace" className="scroll-mt-20 pt-6">
        <ConnectedGrid />
      </div>
      <footer className="border-t border-border py-10 text-center text-sm text-text-muted">
        <p>Stannect — Where Your Business Meets Automation.</p>
      </footer>
    </main>
  );
}
