import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Dental Note",
  description: "AI-powered clinical note generation",
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
