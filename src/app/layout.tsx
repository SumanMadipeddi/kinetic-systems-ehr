import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practice Fusion EHR",
  description: "Practice Fusion EHR frontend clone for technical assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
