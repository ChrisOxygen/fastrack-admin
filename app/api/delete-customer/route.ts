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
  console.log("delete user API fired");
  const data = (await req.json()) as { userId: string };
  const { userId } = data;

  try {
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete({ _id: userId });

    if (!deletedUser) {
      return new Response("user not found", { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("the error that occured", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
