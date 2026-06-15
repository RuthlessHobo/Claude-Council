import type { Metadata } from "next";
import { Poppins, Exo_2 } from "next/font/google";
import "./globals.css";

// Brandmark Sans 10 (the real heading face) has no web source — Poppins is the
// brand-approved geometric fallback. Swap in @font-face here if the file lands.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stannect — Where Your Business Meets Automation",
  description:
    "Your connected workspace. Live KPIs, dashboards, and integrations, all linked through Stannect.",
};

// Set the theme before paint to avoid a flash of the wrong palette.
const themeInit = `
(function () {
  try {
    var stored = localStorage.getItem('stannect-theme');
    var theme = stored || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${poppins.variable} ${exo2.variable}`}>{children}</body>
    </html>
  );
}
