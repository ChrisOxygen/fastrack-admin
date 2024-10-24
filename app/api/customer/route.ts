import Transaction from "@/lib/database/models/transaction.model";
import User from "@/models/user";
import { CustomError } from "@/types";
import { connectToDatabase } from "@/utils/database";

export async function POST(req: Request) {
  console.log("customer API fired");
  const data = (await req.json()) as { userId: string };
  const { userId } = data;

  try {
    await connectToDatabase();

    const customer = await User.findOne({ _id: userId });

    if (!customer) {
      const noCustomerError = new Error() as CustomError;
      noCustomerError.message = "Customer not found";
      noCustomerError.status = 404;

      throw noCustomerError;
    }

    const transactions = await Transaction.find({ user: userId });

    if (!transactions) {
      const noTransactionError = new Error() as CustomError;
      noTransactionError.message = "No transactions found";
      noTransactionError.status = 404;
    }

    const customerTransactions = transactions.map((transaction) => {
      return {
        transactionId: transaction.transactionId,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        fee: transaction.fee,
        createdAt: transaction.createdAt,
      };
    });

    const customerData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      balance: customer.balance,
      transactions: customerTransactions,
    };

    return new Response(JSON.stringify(customerData), {
      status: 200,
    });
  } catch (error) {
    const customError = error as CustomError;
    return new Response(customError.message, { status: customError.status });
  }
}
