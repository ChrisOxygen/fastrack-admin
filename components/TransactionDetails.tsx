"use client";

import { BiCheckCircle, BiCopy } from "react-icons/bi";
import Link from "next/link";
import { RunTransactionType, TransactionType } from "@/types";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runTransaction } from "@/utils/services";
import LoadingSpinner from "./LoadingSpinner";

function getTransactionTitle(type: string) {
  switch (type) {
    case "investment":
      return "Investment";
    case "deposit":
      return "Deposit";
    case "transfer":
      return "Funds Transfer";
    case "investment bonus":
      return "Investment Bonus";
    case "referral bonus":
      return "Referral Bonus";
    default:
      return "Investment";
  }
}

function getSatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pending";
    case "success":
      return "Successful";
    case "error":
      return "Failed";
    default:
      return "Pending";
  }
}

function TransactionDetails({ transaction }: { transaction: TransactionType }) {
  const queryClient = useQueryClient();
  const { mutate: executeTransaction, isPending } = useMutation({
    mutationFn: (payload: RunTransactionType) => {
      return runTransaction(payload);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log(" success data", data);
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });

  const {
    amount,
    status: transactionStatus,
    createdAt,
    type,
    fee,
    updatedAt,
    transactionId: id,
  } = transaction;

  const isAutomaticSuccess =
    createdAt === updatedAt && transactionStatus === "success";

  const isSuccessful = transactionStatus === "success";

  const isFailed = transactionStatus === "error";

  const transRow = isAutomaticSuccess || isSuccessful || isFailed ? 2 : 1;

  const timeLineArray = Array.from({ length: transRow }, (_, i) => {
    return {
      title:
        i === 0
          ? `${getTransactionTitle(type)} Initiated`
          : `${getTransactionTitle(type)} ${getSatusText(transactionStatus)}`,
      date:
        i === 0
          ? new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : new Date(updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
    };
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mx-auto mt-10 flex w-full max-w-[800px] flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <h3 className="font-dm_sans text-xl font-semibold text-siteHeadingDark">
          Amount
        </h3>
        <span className="font-dm_sans text-6xl font-bold">${amount}</span>
        <div className="flex items-center gap-3 rounded-full border border-siteHeadingDark/25 px-3 py-1">
          <span
            className={clsx(
              "h-2 w-2 rounded-full",
              transactionStatus === "pending" && "bg-yellow-500",
              transactionStatus === "success" && "bg-green-600",
              transactionStatus === "error" && "bg-red-700"
            )}
          ></span>
          <span className="font-dm_sans font-bold capitalize text-siteHeadingDark">
            {transactionStatus}
          </span>
        </div>
      </div>
      <div className="flex w-full max-w-[500px] flex-col rounded-2xl border border-siteHeadingDark/25 p-[55px]">
        {timeLineArray.map((timeLine, index, arr) => (
          <div
            key={index}
            className="relative flex w-full flex-col border-b border-siteHeadingDark/25 py-4 last:border-b-0"
          >
            <span
              className={clsx(
                "absolute after:h-[50px] after:w-[2px] left-[-35px] grid place-items-center text-xl content-[''] after:top-0 after:mt-2",
                transactionStatus === "pending" && "text-yellow-500",
                transactionStatus === "success" && "text-green-600",
                transactionStatus === "error" && "text-red-700",
                transactionStatus === "pending" && "after:bg-yellow-500",
                transactionStatus === "success" && "after:bg-green-600",
                transactionStatus === "error" && "after:bg-red-700",
                index === arr.length - 1 ? "after:hidden" : "after:block"
              )}
            >
              <BiCheckCircle />
            </span>
            <p className="font-dm_sans text-lg font-bold capitalize text-siteHeadingDark">
              {timeLine.title}
            </p>
            <span className="font-dm_sans text-siteHeadingDark/50">
              {timeLine.date}
            </span>
          </div>
        ))}
      </div>
      <div className="gap4 flex w-full max-w-[500px] flex-col">
        <p className="font-dm_sans text-xl font-bold text-siteHeadingDark">
          Transaction Details
        </p>
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b-2 border-dashed border-siteHeadingDark/25 py-3 font-dm_sans">
            <span className="text-lg font-semibold text-siteHeadingDark/70">
              Transaction ID
            </span>
            <div className="flex items-center gap-2 text-lg font-black text-black">
              <span className="">{id}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-b-2 border-dashed border-siteHeadingDark/25 py-3 font-dm_sans">
            <span className="text-lg font-semibold text-siteHeadingDark/70">
              {type} Amount
            </span>
            <div className="flex items-center gap-2 text-lg font-black text-black">
              <span className="">${amount}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-b-2 border-dashed border-siteHeadingDark/25 py-3 font-dm_sans">
            <span className="text-lg font-semibold text-siteHeadingDark/70">
              Fees
            </span>
            <div className="flex items-center gap-2 text-lg font-black text-black">
              <span className="">${fee}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full items-center">
        {isSuccessful || isFailed ? (
          <div className="flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="grid w-full place-items-center rounded-xl bg-siteHeadingDark px-6 py-3 font-dm_sans text-lg font-bold text-white"
            >
              Return to Dashboard
            </Link>
            <button
              className="grid w-full place-items-center rounded-xl bg-orange-400 px-6 py-3 font-dm_sans text-lg font-bold text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-5">
            <div className="flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <button
                className="grid w-full place-items-center rounded-xl bg-green-600 px-6 py-3 font-dm_sans text-lg font-bold text-white"
                onClick={function () {
                  executeTransaction({ id, action: "approve" });
                }}
              >
                Approve
              </button>
              <button
                className="grid w-full place-items-center rounded-xl bg-red-500 px-6 py-3 font-dm_sans text-lg font-bold text-white"
                onClick={() => executeTransaction({ id, action: "decline" })}
              >
                Reject
              </button>
            </div>
            <div className="flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="grid w-full place-items-center rounded-xl bg-siteHeadingDark px-6 py-3 font-dm_sans text-lg font-bold text-white"
              >
                Return to Dashboard
              </Link>
              <button
                className="grid w-full place-items-center rounded-xl bg-orange-400 px-6 py-3 font-dm_sans text-lg font-bold text-white"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TransactionDetails;
