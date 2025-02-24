"use server";

import { connectToDatabase } from "@/utils/database";
import Admin from "../database/models/admin.model";
import Transaction from "../database/models/transaction.model";
import User from "../database/models/user.model";
import { handleError } from "../errorHandler";

export async function fetchAdmin(id: string) {
  console.log("fetchAdmin API fired", id);
  try {
    await connectToDatabase();

    const admin = await Admin.findById(id);

    console.log("---------admin", admin);

    const allTransactions = await Transaction.find({}, null, {
      sort: { createdAt: -1 },
    });

    const allUsers = await User.find();

    const users = allUsers.map((user) => {
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance,
        createdAt: user.createdAt,
      };
    });

    const AdminData = {
      fullName: admin.fullName,
      email: admin.email,
      users: users,
      transactions: allTransactions,
    };

    return AdminData ? JSON.parse(JSON.stringify(AdminData)) : null;
  } catch (error) {
    handleError(error, "fetchAdmin");
  }
}
