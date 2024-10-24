import Admin from "@/models/admin";

import Transaction from "@/lib/database/models/transaction.model";
import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";

export async function POST(req: Request) {
  console.log("admin API fired");
  const data = (await req.json()) as { id: string };
  const { id } = data;

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ _id: id });

    if (!admin) {
      return new Response("Admin not found", { status: 404 });
    }

    const allTransactions = await Transaction.find();

    if (!allTransactions) {
      return new Response("No transactions found", { status: 404 });
    }

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

    if (!allUsers) {
      return new Response("No users found", { status: 404 });
    }

    const AdminData = {
      fullName: admin.fullName,
      email: admin.email,
      transactions: allTransactions,
      users: users,
    };

    return new Response(JSON.stringify(AdminData), {
      status: 200,
    });
  } catch (error) {
    console.log("the error that occured", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
