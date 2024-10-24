import Code from "@/models/code";
import DepositTransaction from "@/models/depositTransaction";
import { Transaction } from "@/lib/database/models/transaction.model";
import TransferTransaction from "@/models/transferTransaction";
import User from "@/models/user";
import WithdrawalTransaction from "@/models/withdrawalTransaction";
import { RunTransactionType } from "@/types";
import { connectToDatabase } from "@/utils/database";
import { tr } from "framer-motion/client";
import { use } from "react";

export async function POST(req: Request) {
  console.log("run transaction API fired");
  const data = (await req.json()) as RunTransactionType;
  const { id, action } = data;

  try {
    await connectToDatabase();

    const transaction = await Transaction.findOne({ transactionId: id });

    if (!transaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    console.log("transaction", transaction);

    const user = await User.findOne({ _id: transaction.user });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    console.log("user", user);

    if (action === "approve") {
      console.log("approve transaction=============");
      const { amount, type } = transaction;

      if (type === "deposit") {
        const depositeTransaction = await DepositTransaction.findOne({
          transaction: transaction._id,
        });

        if (!depositeTransaction) {
          return new Response("Transaction not found", { status: 404 });
        }

        console.log("depositeTransaction", depositeTransaction);

        const { amountToRevive, tax, transferMethod } = depositeTransaction;

        user.balance += amountToRevive;

        const savedUser = await user.save();

        if (!savedUser) {
          return new Response("User not saved", { status: 500 });
        }

        console.log("savedUser", savedUser);

        transaction.status = "success";

        const savedTransaction = await transaction.save();

        if (!savedTransaction) {
          return new Response("Transaction not saved", { status: 500 });
        }
      }
      if (type === "transfer") {
        const transferTransaction = await TransferTransaction.findOne({
          transaction: transaction._id,
        });

        if (!transferTransaction) {
          return new Response("Transaction not found", { status: 404 });
        }

        const { amountToRevive, tax, reciverEmail, note } = transferTransaction;
        const reciver = await User.findOne({ email: reciverEmail });

        if (!reciver) {
          return new Response("Reciver not found", { status: 404 });
        }

        reciver.balance += amount;

        const savedReciver = await reciver.save();

        if (!savedReciver) {
          return new Response("User not saved", { status: 500 });
        }

        transaction.status = "success";

        const savedTransaction = await transaction.save();

        if (!savedTransaction) {
          return new Response("Transaction not saved", { status: 500 });
        }
      }
      if (type === "withdraw") {
        const withdrawTransaction = await WithdrawalTransaction.findOne({
          transaction: transaction._id,
        });

        if (!withdrawTransaction) {
          return new Response("Transaction not found", { status: 404 });
        }

        const {
          amountToRevive,
          tax,
          withdrawalMethod,
          deductableAmount,
          payPalEmail,
          bankName,
          accountNumber,
          accountName,
        } = withdrawTransaction;

        //TODO: add tax company tax purse

        //TODO: add deductable amount to company purse

        transaction.status = "success";

        const savedTransaction = await transaction.save();

        if (!savedTransaction) {
          return new Response("Transaction not saved", { status: 500 });
        }
      }
    }

    return new Response(JSON.stringify({ message: "Transaction Succesful" }), {
      status: 200,
    });
  } catch (error) {
    console.log("the error that occured", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
