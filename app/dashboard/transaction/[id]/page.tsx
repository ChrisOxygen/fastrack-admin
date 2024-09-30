"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import TransactionDetails from "@/components/TransactionDetails";
import { fetchTransaction } from "@/utils/services";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

function Transaction() {
  const { id } = useParams();
  const router = useRouter();

  console.log(id, "from transaction page");

  const {
    isPending,
    isError,
    data: transaction,
    error,
  } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => fetchTransaction(id as string),
  });

  if (!id) {
    router.push("/dashboard");
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  return <TransactionDetails transaction={transaction} />;
}

export default Transaction;
