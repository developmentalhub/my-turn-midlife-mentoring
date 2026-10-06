import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Turn | Never Too Old to Play",
  description:
    "A gentle midlife connection, play and wellbeing pilot for women in Chirnside Park and the Yarra Ranges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
