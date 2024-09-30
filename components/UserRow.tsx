import { UserDataType } from "@/types";
import { formatCurrency } from "@/utils/tools";
import Link from "next/link";
import React from "react";
import { FiEye } from "react-icons/fi";

import { useMediaQuery } from "react-responsive";

function UserRow({ customer }: { customer: UserDataType }) {
  const isNotMobile = useMediaQuery({
    query: "(min-width: 664px)",
  });

  const { firstName, lastName, email, balance, createdAt, _id } = customer;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isNotMobile) {
    return (
      <div className=" w-full hidden  border-b last:border-0 border-siteHeadingDark/25 p-4 sm:grid grid-cols-[minmax(200px,300px)_minmax(140px,160px)_minmax(140px,170px)_minmax(100px,1fr)] even:bg-stone-50 items-center">
        <div className="  font-dm_sans text-stone-400">
          <h3 className=" text-siteHeadingDark text-xl font-bold">
            {firstName} {lastName}
          </h3>
          <span className="">{email}</span>
        </div>
        <div className="uppercase font-dm_sans font-semibold text-stone-400 justify-self-center">
          {formattedDate}
        </div>
        <div className="uppercase font-dm_sans text-lg font-bold text-siteHeadingDark justify-self-center">
          {formatCurrency(balance)}
        </div>
        <div className="uppercase font-dm_sans font-semibold text-stone-400 justify-self-end mr-5">
          <Link
            href={`/dashboard/user/${_id}`}
            className=" flex uppercase lg:border-b border-blue-600 text-blue-600 font-dm_sans font-semibold"
          >
            <span className="hidden lg:block">view Details</span>
            <span className=" text-2xl block lg:hidden">
              <FiEye />
            </span>
          </Link>
        </div>
      </div>
    );
  }
  if (!isNotMobile) {
    return (
      <Link
        href={`/dashboard/user/${_id}`}
        className=" w-full  flex-col xsm:flex-row gap-3 xsm:gap-0 items-start border-b last:border-0 border-siteHeadingDark/25 p-4  sm:hidden flex  even:bg-stone-50 xsm:items-center justify-between"
      >
        <div className="  font-dm_sans text-stone-400">
          <h3 className=" text-siteHeadingDark text-xl font-bold">
            {firstName} {lastName}
          </h3>
          <span className="">{email}</span>
        </div>

        <div className="uppercase font-dm_sans text-xl xsm:text-2xl font-bold text-siteHeadingDark justify-self-center">
          {formatCurrency(balance)}
        </div>
      </Link>
    );
  }
}

export default UserRow;
