import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Backlink Blueprint | Off-Page SEO Campaign Builder",
  description:
    "Plan, orchestrate, and track off-page SEO campaigns with tailored backlink opportunities, outreach templates, and KPI timelines.",
  keywords: [
    "backlink planner",
    "off-page seo",
    "link building strategy",
    "outreach templates",
    "seo campaign dashboard",
  ],
  openGraph: {
    title: "Backlink Blueprint | Off-Page SEO Campaign Builder",
    description:
      "Interactive toolkit for generating backlink opportunities, outreach emails, and KPI tracking for off-page SEO.",
    url: "https://agentic-02d66b62.vercel.app",
    siteName: "Backlink Blueprint",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backlink Blueprint | Off-Page SEO Campaign Builder",
    description:
      "Spin up outreach angles, linkable asset ideas, and a KPI roadmap with this off-page SEO control center.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
