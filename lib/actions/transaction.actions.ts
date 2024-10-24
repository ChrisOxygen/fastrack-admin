"use server";

import { connectToDatabase } from "../database";
import Transaction from "../database/models/transaction.model";
import User from "../database/models/user.model";
import { handleError } from "../errorHandler";
import { getTransactionId } from "../utils";

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

  console.log("transactionData", transactionData);
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

    console.log("the updated user", user);

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
