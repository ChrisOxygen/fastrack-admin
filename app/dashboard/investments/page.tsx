"use client";

import ComingSoon from "@/components/ComingSoon";
import InvestmentsDisplay from "@/components/InvestmentsDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import TransactionPagination from "@/components/TransactionPagination";
import { getAllInvestments } from "@/lib/actions/investment.actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

function Investments() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    data,
    error,
    status: investmentsStatus,
  } = useQuery({
    queryKey: ["investments", currentPage],
    queryFn: () => {
      return getAllInvestments(currentPage);
    },
    enabled: !!session?.user.id,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (investmentsStatus === "pending" || status === "loading")
    return <LoadingSpinner />;
  if (status === "unauthenticated") {
    redirect("/login");
  }

  console.log("data", data);

  return (
    <section className="">
      <InvestmentsDisplay
        currentPage={currentPage}
        investments={data?.allInvestments}
      />
      <div className="flex w-[90%] items-center justify-between">
        <div className="grid place-items-center">
          <TransactionPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalItems={data?.numberOfInvestments!}
          />
        </div>
      </div>
    </section>
  );
}

export default Investments;
