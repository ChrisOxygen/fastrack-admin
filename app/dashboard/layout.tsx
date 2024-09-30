"use client";

import DesktopPageLink from "@/components/DesktopPageLink";
import LoadingSpinner from "@/components/LoadingSpinner";
import MobileMenuModal from "@/components/MobileMenuModal";
import MobilePageLink from "@/components/MobilePageLink";
import useFetchAdmin from "@/hooks/useFetchAdmin";
import { TransactionsProvider } from "@/providers/TransactionContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  FiAlertCircle,
  FiBarChart,
  FiGrid,
  FiLayers,
  FiMail,
  FiPaperclip,
  FiPower,
  FiUsers,
} from "react-icons/fi";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, isPending, isError, data } = useFetchAdmin();

  if (!isPending) {
    console.log("data", data);
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <main className=" w-full h-full  md:h-screen  overflow-visible md:overflow-hidden md:grid lg:grid-cols-[minmax(220px,300px)_minmax(800px,1fr)] flex flex-col md:grid-cols-[minmax(190px,220px)_minmax(600px,1fr)]">
      <section className=" p-5 hidden md:flex flex-col w-full overflow-hidden bg-siteHeadingDark text-white">
        <div className="">
          <Link
            href="/"
            className="flex gap-2 text-center font-syne text-xl font-bold mb-4"
          >
            <Image
              src="/fastrack-white.png"
              alt="fastrack"
              width={200}
              height={10}
            />
          </Link>
        </div>
        <div className=" flex flex-col gap-4 mt-12">
          <DesktopPageLink icon={<FiGrid />} title="Dashboard" />
          <DesktopPageLink icon={<FiLayers />} title="Transactions" />
          <DesktopPageLink icon={<FiAlertCircle />} title="Pending" />
          <DesktopPageLink icon={<FiUsers />} title="Users" />
          <DesktopPageLink icon={<FiBarChart />} title="Investments" />
          <DesktopPageLink icon={<FiMail />} title="Messages" />
          <DesktopPageLink icon={<FiPaperclip />} title="Tickets" />
        </div>
        <div className=" mt-auto border-t border-white/20 py-4">
          <button
            className=" flex gap-2 font-dm_sans items-center text-red-500 font-bold"
            onClick={() => signOut()}
          >
            <span className=" text-2xl">
              <FiPower />
            </span>
            <span className="">Logout</span>
          </button>
        </div>
      </section>
      <div className="md:hidden p-5 flex items-center bg-siteHeadingDark w-full justify-between">
        <Link
          href="/"
          className="grid place-items-center self-end gap-2 text-center font-syne text-xl font-bold"
        >
          <Image
            src="/fastrack-white.png"
            alt="fastrack"
            width={200}
            height={10}
          />
        </Link>
        <div className=" ">
          <MobileMenuModal />
        </div>
      </div>
      <section className="w-full h-full grid place-items-center grid-rows-1 p-5 md:h-screen overflow-auto md:overflow-hidden md:mb-0 mb-24">
        <TransactionsProvider>{children}</TransactionsProvider>
      </section>
      <div className="md:hidden drop-shadow-[0_-38px_50px_rgba(0,0,0,0.25)] p-5 flex items-center bg-siteHeadingDark w-full fixed bottom-0 justify-between">
        <MobilePageLink icon={<FiGrid />} title="Dashboard" />
        <MobilePageLink icon={<FiAlertCircle />} title="Pending" />
        <MobilePageLink icon={<FiMail />} title="Messages" />
        <MobilePageLink icon={<FiPaperclip />} title="Tickets" />
      </div>
    </main>
  );
}

export default DashboardLayout;
