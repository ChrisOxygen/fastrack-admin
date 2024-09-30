import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function ErrorHandler({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <section className=" h-full grid place-items-center grid-rows-1 mt-40 place-content-center">
      <div className="flex flex-col gap-3 items-center font-dm_sans text-siteHeadingDark">
        <h1 className="text-4xl font-bold">{error.message}</h1>
        <p className=" text-siteHeadingDark/70 text-center max-[500px]">
          Obviously, somthing went wrong. use the button below to go back, or go
          to the dashboard
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-siteHeadingDark rounded-lg px-5 py-4 text-white font-semibold  text-center"
          >
            Go To Dashboard
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-orange-500 rounded-lg px-5 py-4 text-white font-semibold  text-center"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}

export default ErrorHandler;
