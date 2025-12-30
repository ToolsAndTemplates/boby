import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Pong - Single Player Challenge",
  description: "A visually stunning, neon-themed Pong game with advanced features. Play against a wall, build combos, and beat your high score!",
  keywords: ["pong", "game", "neon", "arcade", "single player", "canvas", "next.js"],
  authors: [{ name: "Pong Game" }],
  openGraph: {
    title: "Neon Pong - Single Player Challenge",
    description: "A visually stunning, neon-themed Pong game with advanced features",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
