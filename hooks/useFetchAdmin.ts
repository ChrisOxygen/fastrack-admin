"use client";

import { fetchAdmin } from "@/lib/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function useFetchAdmin() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/");
  } else {
    console.log("session", session);
  }

  const user = session?.user!;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["admin"],
    queryFn: () => fetchAdmin(user?.id),
    enabled: !!user?.id,
  });

  return { session, isPending, isError, data, error };
}

export default useFetchAdmin;
