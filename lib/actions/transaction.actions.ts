"use server";

import { CreateTransactionType } from "@/types";
import { connectToDatabase } from "../database";
import Transaction from "../database/models/transaction.model";
import User from "../database/models/user.model";
import { handleError } from "../errorHandler";
import { getTransactionId } from "../utils";
import ShortUniqueId from "short-unique-id";

export async function getAllTransactions() {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find();

    return transactions ? JSON.parse(JSON.stringify(transactions)) : null;
  } catch (error) {
    handleError(error, "getAllTransactions");
  }
}

export async function createNewTransaction(transactionData: {
  type: string;
  amount: number;
  userId: string;
}) {
  const { type, amount, userId } = transactionData;

  try {
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ _id: userId });

    const allTransactions = await getAllTransactions();

    const transactionId = getTransactionId(allTransactions);

    const newTransaction = await Transaction.create({
      transactionId,
      type,
      amount,
      status: "success",
      fee: 0,
      user: user._id,
    });

    user.balance += amount;
    await user.save();

    return newTransaction ? JSON.parse(JSON.stringify(newTransaction)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function approveTransaction({
  transactionId,
  amount,
}: {
  transactionId: string;
  amount: number;
}) {
  try {
    await connectToDatabase();

    const transaction = await Transaction.findOne({ transactionId });

    transaction.status = "success";
    transaction.amount = amount;

    await transaction.save();

    const user = await User.findOne({ _id: transaction.user });

    user.balance += amount - transaction.fee;

    await user.save();

    return transaction ? JSON.parse(JSON.stringify(transaction)) : null;
  } catch (error) {
    handleError(error, "approveTransaction");
  }
}

export const createTransaction = async (
  transactionDetails: CreateTransactionType
) => {
  const { type, amount, status, fee, userId } = transactionDetails;
  try {
    await connectToDatabase();

    const user = await User.findById({ _id: userId });

    if (type === "withdrawal" && user.balance < amount + fee) {
      throw new Error("Insufficient balance");
    }

    const uid = new ShortUniqueId();

    const uniqueTransactionId = `TR-${uid.stamp(10)}`;

    const transactionObj = {
      transactionId: uniqueTransactionId,
      type: type,
      amount: amount,
      status: status,
      fee: fee,
      user: user._id,
    };

    const newTransaction = await Transaction.create(transactionObj);

    if (newTransaction.status === "success") {
      if (newTransaction.type === "investment deposit") {
        user.balance -= amount;
      }
      if (newTransaction.type === "investment payout") {
        user.balance += amount;
      }

      if (type === "signup bonus") {
        user.balance += amount;
      }
    }
    if (newTransaction.status === "pending") {
      if (newTransaction.type === "withdrawal") {
        user.balance -= amount + fee;
      }
    }

    await user.save();

    return newTransaction ? JSON.parse(JSON.stringify(newTransaction)) : null;
  } catch (error) {
    // handleError(error, "createTransaction");

    throw error;
  }
};
