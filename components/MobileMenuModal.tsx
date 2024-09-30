import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";

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
import Modal from "react-responsive-modal";
import MenuModalPageLink from "./MenuModalPageLink";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

function MobileMenuModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      onCloseModal();
    };

    if (pathname) {
      handleRouteChange();
    }
  }, [pathname]);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <>
      <button
        className={clsx(" text-2xl text-white w-full bg-transparent")}
        onClick={onOpenModal}
      >
        <FiMenu />
      </button>
      <Modal
        classNames={{
          modal: "menuModalBox",
        }}
        open={open}
        onClose={onCloseModal}
      >
        <div className=" w-full flex flex-col h-full gap-8">
          <div className="flex items-start w-full">
            <Link
              href="/"
              className="grid place-items-center self-end gap-2 text-center font-syne text-xl font-bold"
            >
              <Image
                src="/fastrack-black.png"
                alt="fastrack"
                width={200}
                height={10}
              />
            </Link>
          </div>
          <div className="w-full flex flex-col mt-[100px] mb-auto">
            <MenuModalPageLink icon={<FiGrid />} title="Dashboard" />
            <MenuModalPageLink icon={<FiLayers />} title="Transactions" />
            <MenuModalPageLink icon={<FiAlertCircle />} title="Pending" />
            <MenuModalPageLink icon={<FiUsers />} title="Users" />
            <MenuModalPageLink icon={<FiBarChart />} title="Investments" />
            <MenuModalPageLink icon={<FiMail />} title="Messages" />
            <MenuModalPageLink icon={<FiPaperclip />} title="Tickets" />
          </div>
          <div className=" mt-auto">
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
        </div>
      </Modal>
    </>
  );
}

export default MobileMenuModal;
