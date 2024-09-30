import Admin from "@/models/admin";
import Code from "@/models/code";
import {
  AdminDataType,
  ErrorWithMessageAndStatus,
  SignupDataType,
} from "@/types";
import { connectToDatabase } from "@/utils/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  console.log("sign up API fired");
  const signupDetail = (await req.json()) as SignupDataType;
  const { fullName, email, password, code } = signupDetail;

  try {
    await connectToDatabase();

    const codeFromDb = await Code.findOne();

    if (!codeFromDb) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Code not found";
      error.status = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(code, codeFromDb.adminCode);

    if (!isValid) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "invalid code";
      error.status = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      fullName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    console.log("new admin", newAdmin);

    if (!newAdmin) {
      const error = new Error() as ErrorWithMessageAndStatus;
      error.message = "Something went wrong";
      error.status = 500;
      throw error;
    }

    const {
      _id,
      fullName: fullNameDB,
      email: emailDB,
    } = newAdmin as AdminDataType;

    const adminData = { _id, fullNameDB, emailDB };

    return new Response(
      JSON.stringify({ message: "Admin created", adminData }),
      {
        status: 201,
      }
    );
  } catch (error) {
    const { message, status } = error as ErrorWithMessageAndStatus;

    return new Response(message, { status: status || 500 });
  }
}
