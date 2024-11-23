"use client";

import InvestmentsDisplay from "@/components/InvestmentsDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import TransactionPagination from "@/components/TransactionPagination";
import { getUserInvestments } from "@/lib/actions/investment.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { formatToUSD } from "@/utils/services";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

function UserInvestmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  const { status: getCustomerStatus, data: customer } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchUser(id as string),
  });

  const { status: getInvestmentsStatus, data } = useQuery({
    queryKey: ["customer", "investment"],
    queryFn: () => getUserInvestments(id as string, currentPage),
    enabled: !!customer,
  });

  if (getInvestmentsStatus === "pending" || getCustomerStatus === "pending") {
    return <LoadingSpinner />;
  }

  const { firstName, lastName, email } = customer!;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <section className="w-full">
      <div className="flex flex-col items-center">
        <Image
          src="/customer-avatar.jpg"
          alt="customer image"
          className="  rounded-full"
          width={130}
          height={130}
        />
        <div className=" flex flex-col gap-2 font-dm_sans items-center ">
          <span className=" text-2xl font-bold text-siteHeadingDark">
            {firstName} {lastName}
          </span>
          <span className=" text-siteHeadingDark/50 italic">{email}</span>
        </div>
      </div>
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

export default UserInvestmentsPage;
