import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Looma - Your Artisan Workspace",
  description:
    "A dashboard for handloom artisans to track projects and manage yarn inventory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${lora.variable} antialiased bg-paper-texture h-full min-h-screen`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
