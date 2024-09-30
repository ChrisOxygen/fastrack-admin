import Image from "next/image";
import Link from "next/link";
import React from "react";

function Signup() {
  return (
    <main className="font-dm_sans w-full h-screen grid place-items-center place-content-center ">
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
      <p className=" font-semibold text-lg font-dm_sans mb-4">
        You need an admin ID to sign up. contact admin@fastrack for mre details.
      </p>

      <span className="text-lg font-dm_sans text-gray-400">
        Already an admin?
      </span>
      <Link
        href="/login"
        className="px-3 py-2 w-40 text-center mt-3 rounded-md bg-siteHeadingDark text-white text-xl capitalize font-bold"
      >
        Log in
      </Link>
    </main>
  );
}

export default Signup;
