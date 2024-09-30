"use client";

import { fetchCustomer } from "@/utils/services";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function useFetchCustomer(userId: string) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/");
  }

  const user = session?.user!;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["customer"],
    queryFn: () => fetchCustomer(userId),
  });

  return { session, isPending, isError, data, error };
}

export default useFetchCustomer;
