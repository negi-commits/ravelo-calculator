import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cost of Manual Work Calculator - Ravelo",
  description:
    "Find out how much repetitive manual work is costing your business annually. Free calculator with instant results.",
  openGraph: {
    title: "Cost of Manual Work Calculator",
    description: "See the real annual cost of your team's manual tasks in 2 minutes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06060e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
