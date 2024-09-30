"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import Select from "@/components/Select";
import TransactionRow from "@/components/TransactionRow";
import { useTransactionsContext } from "@/providers/TransactionContext";
import React from "react";

function Transactions() {
  const {
    transactionTypes,
    transactionStatus,
    isPending,
    isError,
    selectFilterItem,
    filteredTransactions,
    resetFilters,
    statusFilterActive,
    typesFilterActive,
  } = useTransactionsContext()!;

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" w-full sm:gap-6 gap-8 shrink  flex h-full flex-col ">
      <div className=" flex flex-col items-start grid1364:items-end gap-3 mt-6 grid1364:flex-row">
        <div className=" shrink-0">
          <h1 className="text-4xl font-semibold text-siteHeadingDark font-dm_sans">
            Transactions
          </h1>
          <span className="">All users transactions done with the app.</span>
        </div>
        <div className=" flex w-full justify-end sm:flex-row flex-col gap-5">
          <Select
            filterItems={transactionTypes}
            filterType="type"
            selectItem={selectFilterItem}
          />
          <Select
            filterItems={transactionStatus}
            filterType="status"
            selectItem={selectFilterItem}
          />
          <button
            className="  rounded-xl bg-siteHeadingDark text-white font-dm_sans font-semibold px-5 py-3 sm:w-[140px] w-full"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 overflow-auto md:overflow-hidden ">
        <div
          className={`grid1364:grid-cols-[minmax(200px,300px)_minmax(70px,200px)_minmax(80px,200px)_minmax(110px,250px)_minmax(50px,140px)_minmax(70px,140px)] grid1364:gap-3 hidden w-full justify-between gap-0 border-y border-siteHeadingDark/20 px-5 py-2 sm:grid  grid-cols-[minmax(180px,300px)_minmax(70px,200px)_minmax(80px,200px)_minmax(0,250px)_minmax(0,140px)_minmax(70px,140px)]`}
        >
          <span className="text-sm text-siteHeadingDark/60">TYPE</span>
          <span className="justify-self-center text-sm text-siteHeadingDark/60">
            AMOUNT
          </span>
          <span className="justify-self-center text-sm text-siteHeadingDark/60">
            STATUS
          </span>
          <span className="grid1364:block hidden justify-self-center text-sm text-siteHeadingDark/60 lg:hidden">
            TRANS.ID
          </span>
          <span className="grid1364:block hidden justify-self-center text-sm text-siteHeadingDark/60 lg:hidden">
            FEE
          </span>

          <span className="col-start-6 block w-[40px] justify-self-center text-sm text-siteHeadingDark/60"></span>
        </div>
        <div className="flex flex-col overflow-scroll">
          {filteredTransactions.map((transaction, index) => (
            <TransactionRow
              key={index}
              isLast={filteredTransactions.length - 1 === index}
              isFirst={index === 0}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
