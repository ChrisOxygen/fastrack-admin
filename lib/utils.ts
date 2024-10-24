import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ITransaction } from "./database/models/transaction.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const generateUniqueTransactionId = (allTransactionsIds: string[]) => {
  let newTransactionId = getRandomString(10);
  while (allTransactionsIds.includes(newTransactionId)) {
    newTransactionId = getRandomString(10);
  }

  return newTransactionId;
};

export function getTransactionId(transactions: ITransaction[]) {
  const allTransactionIds = transactions.map((transaction) => {
    return transaction.transactionId;
  });

  return generateUniqueTransactionId(allTransactionIds as string[]);
}
