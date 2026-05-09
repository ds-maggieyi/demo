import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Two Side View Ordering",
  description: "Digital dental ordering platform",
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
