import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildTruth | Launch Waitlist",
  description: "Landing page and waitlist flow for BuildTruth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
