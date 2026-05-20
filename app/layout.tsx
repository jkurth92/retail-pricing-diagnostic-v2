import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retail Pricing Diagnostic",
  description:
    "Analyze pricing, promotions, and markdown opportunity using client evidence and benchmark interpretation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
