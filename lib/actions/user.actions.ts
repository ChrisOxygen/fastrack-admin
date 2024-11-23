"use server";

import User from "@/models/user";
import { CustomerData } from "@/types";
import { connectToDatabase } from "@/utils/database";
import { use } from "react";

export const fetchUser = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const userData = user ? JSON.parse(JSON.stringify(user)) : null;

    const userObj = {
      _id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      balance: userData.balance,
      createdAt: userData.createdAt,
    };

    return userObj as {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      balance: number;
      createdAt: Date;
    };
  } catch (error) {
    throw error;
  }
};
