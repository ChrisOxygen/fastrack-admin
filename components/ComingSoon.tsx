import Link from "next/link";

function ComingSoon() {
  return (
    <section className=" h-full grid place-items-center grid-rows-1 place-content-center">
      <div className="flex flex-col gap-3 items-center font-dm_sans text-siteHeadingDark">
        <h1 className="text-4xl font-bold">Under Construction</h1>
        <p className=" text-siteHeadingDark/70">We are working on this page.</p>
        <Link
          href="/dashboard"
          className="bg-siteHeadingDark rounded-lg px-5 py-4 text-white font-semibold  text-center"
        >
          Go To Dashboard
        </Link>
      </div>
    </section>
  );
}

export default ComingSoon;
