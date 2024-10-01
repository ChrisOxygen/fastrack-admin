"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import Overview from "@/components/Overview";
import RecentActivity from "@/components/RecentActivity";
import useFetchAdmin from "@/hooks/useFetchAdmin";

function Dashboard() {
  const { session, isPending, isError, data } = useFetchAdmin();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else if (hour >= 18 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }

  if (!isPending) {
    console.log("data", data);
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (data === undefined) {
    return;
  }

  const firstName = data.fullName.split(" ")[0];

  return (
    <main className=" w-full overflow-auto md:overflow-hidden  grid md:grid-rows-[max-content_max-content_minmax(0,1fr)] grid-rows-[max-content_max-content_max-content] grid-flow-row h-full  gap-5 ">
      <h4 className=" font-dm_sans text-4xl text-siteHeadingDark">
        {getGreeting()}, {firstName}
      </h4>
      <Overview data={data} />
      <div className=" w-full block md:grid md:grid-rows-1 overflow-scroll ">
        <RecentActivity />
      </div>
    </main>
  );
}

export default Dashboard;
