"use server";

import { connectToDatabase } from "@/utils/database";
import Investment from "../database/models/investment.model";
import { InvestmentType } from "@/types";
import { INVESTMENTS_PER_PAGE } from "@/constants";
import { createNewTransaction, createTransaction } from "./transaction.actions";

export const getAllInvestments = async (page: number) => {
  console.log("getAllInvestments API fired", page);
  try {
    await connectToDatabase();
    const numberOfInvestments = await Investment.countDocuments();
    const investments = await Investment.find({}, null, {
      sort: { createdAt: -1 },
      limit: INVESTMENTS_PER_PAGE,
      skip: (page - 1) * INVESTMENTS_PER_PAGE,
    });

    const allInvestments = investments
      ? JSON.parse(JSON.stringify(investments))
      : null;

    console.log("allInvestments", allInvestments);

    return {
      allInvestments,
      numberOfInvestments,
    } as {
      allInvestments: InvestmentType[];
      numberOfInvestments: number;
    };
  } catch (error) {}
};

export const getUserInvestments = async (id: string, page: number) => {
  try {
    await connectToDatabase();
    const numberOfInvestments = await Investment.countDocuments();
    const investments = await Investment.find({ user: id }, null, {
      sort: { createdAt: -1 },
      limit: INVESTMENTS_PER_PAGE,
      skip: (page - 1) * INVESTMENTS_PER_PAGE,
    });

    const allInvestments = investments
      ? JSON.parse(JSON.stringify(investments))
      : null;

    console.log("allInvestments", allInvestments);

    return {
      allInvestments,
      numberOfInvestments,
    } as {
      allInvestments: InvestmentType[];
      numberOfInvestments: number;
    };
  } catch (error) {
    throw new Error("Error fetching investments");
  }
};

export const getInvestment = async (id: string) => {
  try {
    await connectToDatabase();
    const investment = await Investment.findById(id);

    const singleIv = investment ? JSON.parse(JSON.stringify(investment)) : null;

    return singleIv as InvestmentType;
  } catch (error) {
    throw new Error("Error fetching investment");
  }
};

export const completeInvestment = async ({
  id,
  finalReturns,
}: {
  id: string;
  finalReturns: number;
}) => {
  try {
    await connectToDatabase();

    const investment = await Investment.findOneAndUpdate(
      { _id: id },
      { $set: { returns: finalReturns, status: "completed" } },
      { new: true }
    );

    if (!investment) {
      throw new Error("Investment not found");
    }

    console.log("investment", investment);

    const newTransaction = await createTransaction({
      type: "investment payout",
      amount: finalReturns,
      status: "success",
      fee: 0,
      userId: investment?.user,
    });

    console.log("newTransaction", newTransaction);

    const singleIv = investment ? JSON.parse(JSON.stringify(investment)) : null;

    return singleIv as InvestmentType;
  } catch (error) {
    throw new Error("Error completing investment");
  }
};
