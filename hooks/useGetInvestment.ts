"use client";

import { fetchAdmin } from "@/lib/actions/admin.actions";
import { getInvestment } from "@/lib/actions/investment.actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function useGetinvestment(id: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user!;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["admin", "investmenmt", id, "customer"],
    queryFn: () => getInvestment(id),
    enabled: !!user?.id,
  });

  return { session, isPending, isError, data, error };
}

export default useGetinvestment;
