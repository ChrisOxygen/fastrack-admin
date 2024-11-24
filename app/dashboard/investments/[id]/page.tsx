"use client";

import CompleteTransactionDialog from "@/components/CompleteTransactionDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import NonActiveBtn from "@/components/NonActiveBtn";
import { Button } from "@/components/ui/button";
import useGetinvestment from "@/hooks/useGetInvestment";
import {
  completeInvestment,
  getInvestment,
} from "@/lib/actions/investment.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { formatToUSD } from "@/utils/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function SingleIv() {
  const { id } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["investmenmt", "customer"],
    queryFn: () => getInvestment(id as string),
  });

  const { status: getCustomerStatus, data: customer } = useQuery({
    queryKey: ["customer", "investment"],
    queryFn: () => fetchUser(data?.user!),
    // The query will not execute until the userId exists
    enabled: !!data?.user,
  });

  if (isPending || getCustomerStatus === "pending") {
    return <LoadingSpinner />;
  }

  const {
    amount,
    status,
    investmentPackage,
    createdAt,
    returns,
    user: userId,
  } = data!;

  const { firstName, lastName, email } = customer!;

  console.log("data", data);
  return (
    <section className="w-full flex flex-col items-center justify-center  gap-3 h-full">
      <div className="flex flex-col gap-3 max-w-[700px] w-full">
        <div className="rounded-xl p-3 border w-full flex justify-between">
          <h2 className="text-4xl font-dm_sans text-gray-400 uppercase">
            Amount
          </h2>
          <div className=" flex flex-col items-end">
            <span className="text-xl text-siteGreen font-dm_sans font-semibold">
              {formatToUSD(amount)}
            </span>
            <span className="font-dm_sans text-gray-400 text-xs uppercase">
              ROI {formatToUSD(returns)}
            </span>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col items-center justify-between gap-3 w-full">
          <span className="bg-gray-200 w-full h-[1px]"></span>

          {status === "processing" ? (
            <Link
              href={`/dashboard/investments/complete/${id}`}
              className=" rounded-xl flex shrink-0 bg-green-500 font-dm_sans text-white uppercase font-semibold px-4 py-2 "
            >
              complete investment
            </Link>
          ) : (
            <NonActiveBtn
              btnText="Complete investment"
              tooltipText="Investment is not processing"
            />
          )}
          <Link
            href={"/dashboard/user/" + userId}
            className=" shrink-0 rounded-xl bg-orange-500 font-dm_sans text-white uppercase font-semibold px-4 py-2 "
          >
            View customer
          </Link>
          <span className="bg-gray-200 w-full h-[1px]"></span>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center w-full gap-4">
            <span className=" font-dm_sans  uppercase text-gray-400">
              Package
            </span>
            <hr className=" border-b border-dashed w-full" />
            <span className="font-dm_sans  uppercase text-siteGreen font-bold">
              {investmentPackage}
            </span>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            <span className=" font-dm_sans  uppercase text-gray-400">
              Status
            </span>
            <hr className=" border-b border-dashed w-full" />
            <span
              className={clsx(
                "grid place-items-center justify-self-center rounded-xl border px-2 py-[2px] text-xs uppercase",
                status === "running" &&
                  "border-orange-200 bg-orange-100 text-orange-500",
                status === "completed" &&
                  "border-green-200 bg-green-100 text-green-500",
                status === "pending" &&
                  "border-gray-200 bg-gray-100 text-gray-300"
              )}
            >
              {status}
            </span>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            <span className=" font-dm_sans shrink-0  uppercase text-gray-400">
              start Date
            </span>
            <hr className=" border-b border-dashed w-full" />
            <span className="font-dm_sans shrink-0  uppercase">
              {new Date(createdAt).toDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            <span className=" font-dm_sans shrink-0  uppercase text-gray-400">
              end Date
            </span>
            <hr className=" border-b border-dashed w-full" />
            <span className="font-dm_sans shrink-0  uppercase">
              {new Date(createdAt).toDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            <span className=" font-dm_sans shrink-0 uppercase text-gray-400">
              Customers Name
            </span>
            <hr className=" border-b border-dashed w-full" />
            <span className="font-dm_sans shrink-0  uppercase text-siteGreen font-bold">
              {firstName} {lastName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SingleIv;
