"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import Select from "@/components/Select";
import TransactionRow from "@/components/TransactionRow";
import {
  SelectItem,
  StateType,
  useTransactionsContext,
} from "@/providers/TransactionContext";
import { UserData } from "@/types";
import React, { useReducer } from "react";

const initialState: StateType = {
  typesFilterActive: false,
  statusFilterActive: false,
  transactionTypes: [
    { key: 1, label: "deposit", isSelected: false },
    { key: 2, label: "withdrawal", isSelected: false },
    { key: 3, label: "transfer", isSelected: false },
  ],
  transactionStatus: [
    { key: 1, label: "pending", isSelected: false },
    { key: 2, label: "success", isSelected: false },
    { key: 3, label: "error", isSelected: false },
  ],
};

function reducer(state: StateType, action: { type: any; payload?: any }) {
  switch (action.type) {
    case "selectItem":
      if (action.payload.filterType === "type") {
        const updatedTypes = state.transactionTypes.map((type) => {
          if (type.key === action.payload.key) {
            return { ...type, isSelected: !type.isSelected };
          }
          return type;
        });
        const hasSelected = updatedTypes.some((type) => type.isSelected);
        return {
          ...state,
          transactionTypes: updatedTypes,
          typesFilterActive: hasSelected,
        };
      } else {
        const updatedStatus = state.transactionStatus.map((status) => {
          if (status.key === action.payload.key) {
            return { ...status, isSelected: !status.isSelected };
          }
          return status;
        });
        const hasSelected = updatedStatus.some((status) => status.isSelected);
        return {
          ...state,
          transactionStatus: updatedStatus,
          statusFilterActive: hasSelected,
        };
      }

    case "activateTypeFilter":
      return { ...state, typesFilterActive: true };
    case "activateStatusFilter":
      return { ...state, statusFilterActive: true };
    case "deactivateTypeFilter":
      return { ...state, typesFilterActive: false };
    case "deactivateStatusFilter":
      return { ...state, statusFilterActive: false };

    case "reset":
      return initialState;

    default:
      throw new Error("unknown action");
  }
}

function UserTransactions({
  transactions,
}: {
  transactions: UserData["transactions"];
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    transactionTypes,
    transactionStatus,
    statusFilterActive,
    typesFilterActive,
  } = state;

  const filteredTransactions = transactions.filter(
    (transaction, index, arr) => {
      const typesFilterArr = transactionTypes
        .filter((type) => type.isSelected)
        .map((type) => type.label);

      const statusFilterArr = transactionStatus
        .filter((type) => type.isSelected)
        .map((type) => type.label);

      if (state.typesFilterActive && state.statusFilterActive) {
        if (
          typesFilterArr.includes(transaction.type) &&
          statusFilterArr.includes(transaction.status)
        ) {
          return transaction;
        }
      }

      if (state.typesFilterActive && !state.statusFilterActive) {
        if (typesFilterArr.includes(transaction.type)) {
          return transaction;
        }
      }

      if (state.statusFilterActive && !state.typesFilterActive) {
        if (statusFilterArr.includes(transaction.status)) {
          return transaction;
        }
      }

      if (!state.typesFilterActive && !state.statusFilterActive) {
        return transaction;
      }
    }
  );

  function selectFilterItem({
    filterType,
    key,
    isSelected,
    label,
  }: SelectItem & { filterType: "type" | "status" }) {
    dispatch({
      type: "selectItem",
      payload: { filterType, key, isSelected, label },
    });
  }

  function resetFilters() {
    dispatch({ type: "reset" });
  }

  return (
    <div className=" w-full sm:gap-6 gap-8 shrink  flex h-full flex-col  ">
      <div className=" flex flex-col items-center sm:items-start grid1364:items-end gap-3 mt-6 grid1364:flex-row">
        <div className=" flex w-full max-w-[400px] sm:max-w-[1000px]  justify-center sm:flex-row flex-col gap-5">
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
            className=" rounded-xl bg-siteHeadingDark text-white font-dm_sans font-semibold px-5 py-3 sm:w-[140px] w-full"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3 overflow-auto md:overflow-hidden ">
        <div
          className={`grid1364:grid-cols-[minmax(200px,300px)_minmax(70px,200px)_minmax(80px,200px)_minmax(110px,250px)_minmax(50px,140px)_minmax(70px,140px)] grid1364:gap-3 hidden w-full justify-between gap-0 border-b border-siteHeadingDark/20  py-2 sm:grid  grid-cols-[minmax(180px,300px)_minmax(70px,200px)_minmax(80px,200px)_minmax(0,250px)_minmax(0,140px)_minmax(70px,140px)]`}
        >
          <span className="text-sm text-siteHeadingDark/60 ml-10">TYPE</span>
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
        <div className="flex flex-col overflow-scroll ">
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

export default UserTransactions;
