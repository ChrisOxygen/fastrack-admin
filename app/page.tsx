import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className=" w-full  h-screen bg-white grid place-items-center">
      <div className=" w-full max-w-[400px] min-h-[400px] p-10 rounded-xl border border-gray-400 flex flex-col items-center ">
        <Link
          href="/"
          className="flex gap-2 text-center font-syne text-xl font-bold mb-4"
        >
          <Image
            src="/fastrack-black.png"
            alt="fastrack"
            width={200}
            height={10}
          />
        </Link>
        <LoginForm />
      </div>
    </main>
  );
}
