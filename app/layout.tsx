import type { Metadata } from "next";
import "./globals.css";
import "react-responsive-modal/styles.css";

import { Syne, DM_Sans } from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";

const syne = Syne({ subsets: ["latin"], variable: "--syne" });
const dm_sans = DM_Sans({ subsets: ["latin"], variable: "--dm-sans" });

export const metadata: Metadata = {
  title: "Fastrack Admin",
  description: "Fastrack Admin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dm_sans.variable}`}
        suppressHydrationWarning
      >
        <NextAuthProvider session={session}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
