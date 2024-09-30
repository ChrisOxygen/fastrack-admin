import Code from "@/models/code";
import { connectToDatabase } from "@/utils/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  console.log("admin code API fired");
  const data = (await req.json()) as { code: string };
  const { code } = data;

  try {
    await connectToDatabase();

    const codeFromDb = await Code.findOne();

    if (!codeFromDb) {
      return new Response("Code not found", { status: 404 });
    }

    const isValid = await bcrypt.compare(code, codeFromDb.adminCode);

    console.log("is valid", isValid);

    if (!isValid) {
      throw new Error("Invalid code");
    }

    return new Response(JSON.stringify({ message: "Valid code" }), {
      status: 200,
    });
  } catch (error) {
    console.log("the error that occured", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
