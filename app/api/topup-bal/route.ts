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
  console.log("top up API fired");
  const data = (await req.json()) as { amount: number; userId: string };
  const { amount, userId } = data;

  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return new Response("user not found", { status: 404 });
    }

    console.log(
      "user balance is a ",
      typeof user.balance,
      "Amount is a ",
      typeof amount
    );

    user.balance += amount;

    const savedUser = await user.save();

    if (!savedUser) {
      throw new Error("somthing went wrong");
    }

    return new Response(JSON.stringify({ message: "Transaction Succesful" }), {
      status: 200,
    });
  } catch (error) {
    console.log("the error that occured", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
