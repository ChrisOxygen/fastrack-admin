import Transaction from "@/lib/database/models/transaction.model";

import { connectToDatabase } from "@/utils/database";

export async function POST(req: Request) {
  console.log("transaction API fired");
  const data = (await req.json()) as { id: string };
  const { id } = data;

  try {
    await connectToDatabase();

    const transaction = await Transaction.findOne({
      transactionId: id,
    });

    if (!transaction) {
      return new Response("transaction not found", { status: 404 });
    }

    return new Response(JSON.stringify(transaction), {
      status: 200,
    });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
