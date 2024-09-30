"use client";
import useFetchAdmin from "@/hooks/useFetchAdmin";
import { UserData } from "@/types";
import { usePathname } from "next/navigation";
import { createContext, use, useContext, useEffect, useReducer } from "react";

export type SelectItem = {
  key: number;
  label: string;
  isSelected: boolean;
};

export type StateType = {
  typesFilterActive: boolean;
  statusFilterActive: boolean;
  transactionTypes: SelectItem[];
  transactionStatus: SelectItem[];
};

export type ValuesType = {
  transactionTypes: SelectItem[];
  transactionStatus: SelectItem[];
  isPending: boolean;
  isError: boolean;
  selectFilterItem: ({
    filterType,
    key,
    isSelected,
    label,
  }: SelectItem & { filterType: "type" | "status" }) => void;
  filteredTransactions: UserData["transactions"];
  resetFilters: () => void;
  statusFilterActive: boolean;
  typesFilterActive: boolean;
};

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

const TransactionsContext = createContext<null | ValuesType>(null);

function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    transactionTypes,
    transactionStatus,
    statusFilterActive,
    typesFilterActive,
  } = state;
  const { session, isPending, isError, data } = useFetchAdmin();
  const pathname = usePathname();

  const { transactions } = data as UserData;

  useEffect(() => {
    if (pathname) {
      dispatch({ type: "reset" });
    }
  }, [pathname]);

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
    <TransactionsContext.Provider
      value={{
        transactionTypes,
        transactionStatus,
        isPending,
        isError,
        selectFilterItem,
        filteredTransactions,
        resetFilters,
        statusFilterActive,
        typesFilterActive,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
//custom hook
function useTransactionsContext() {
  const context = useContext(TransactionsContext);

  if (context === undefined)
    throw new Error(
      "TransactionsContext was used outside the TransactionsProvider"
    );
  return context;
}

export { TransactionsProvider, useTransactionsContext };
