import { AuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";
import Admin from "@/models/admin";
import { ErrorWithMessageAndStatus } from "@/types";

const options: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        console.log("authorized fired", credentials);
        if (!credentials) {
          return null;
        }
        try {
          await connectToDatabase();
          const admin = await Admin.findOne({ email: credentials?.email });

          if (!admin) {
            const error = new Error() as ErrorWithMessageAndStatus;
            error.message = "Admin not found";
            error.status = 404;
            throw error;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            admin.password
          );

          if (!isValid) {
            const error = new Error() as ErrorWithMessageAndStatus;
            error.message = "Invalid password";
            error.status = 403;
            throw error;
          }

          return { email: admin.email, id: admin._id };
        } catch (error) {
          const { message, status } = error as ErrorWithMessageAndStatus;
          console.log("error in authorize", message, status);
          const customError = new Error() as ErrorWithMessageAndStatus;
          customError.message = message;
          customError.status = status;
          throw customError;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.

      session.user = token.user as {
        id: string;
      } & DefaultSession["user"];
      return session;
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
