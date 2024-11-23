"use client";

import DeleteCustomerById from "@/components/DeleteCustomerById";
import ErrorHandler from "@/components/ErrorHandler";
import LoadingSpinner from "@/components/LoadingSpinner";
import ModalBtn from "@/components/ModalBtn";
import TopupCustomerBalance from "@/components/TopupCustomerBalance";
import UserTransactions from "@/components/UserTransactions";
import useFetchCustomer from "@/hooks/useFetchCustomer";
import { deleteCustomer, topupCustomerBal } from "@/utils/services";
import { formatCurrency } from "@/utils/tools";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";

function User() {
  const { id } = useParams();
  const router = useRouter();

  const { isPending, isError, data, error } = useFetchCustomer(id as string);

  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: TopupFormPending,
    isSuccess,
  } = useMutation({
    mutationFn: (data: { amount: number; userId: string }) => {
      return topupCustomerBal(data);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
  const {
    mutate: deleteUser,
    isPending: deleteUserPending,
    isSuccess: deleteUserSuccess,
  } = useMutation({
    mutationFn: (data: { userId: string }) => {
      return deleteCustomer(data);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      router.push("/dashboard/users");
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  if (!isPending) {
    console.log("data", data);
  }

  if (isPending) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorHandler error={error} />;
  }

  if (data === undefined) {
    return;
  }

  const { firstName, email, lastName, balance, transactions } = data;

  const totalDeposits = transactions.reduce((acc: number, transaction: any) => {
    if (transaction.type === "deposit" && transaction.status === "success") {
      return acc + transaction.amount;
    } else {
      return acc;
    }
  }, 0);

  const totalWithdrawals = transactions.reduce(
    (acc: number, transaction: any) => {
      if (
        transaction.type === "withdrawal" &&
        transaction.status === "success"
      ) {
        return acc + transaction.amount;
      } else {
        return acc;
      }
    },
    0
  );

  return (
    <section className=" relative w-full overflow-scroll py-10  grid md:grid-rows-[max-content_max-content_max-content_max-content_minmax(0,1fr)] grid-rows-[max-content_max-content_max-content_max-content_max-content] grid-flow-row justify-items-center h-full gap-5 ">
      <button
        className=" absolute  right-4 top-4 text-2xl"
        onClick={() => router.back()}
      >
        <FiX />
      </button>
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
      <div className="  w-full max-w-[600px] border-t border-b border-siteHeadingDark/30 p-5 flex sm:flex-row flex-col items-start gap-4 justify-between">
        <div className=" w-full flex flex-col gap-2 items-center">
          <span className=" font-dm_sans text-siteHeadingDark font-semibold text-lg">
            Balance
          </span>
          <span className="font-dm_sans text-siteHeadingDark font-bold text-2xl">
            {formatCurrency(balance)}
          </span>
        </div>
        <div className=" w-full flex flex-col gap-2 items-center sm:px-10 px-0 py-8 sm:py-0 sm:border-x border-x-0 sm:border-y-0 border-y border-siteHeadingDark/30">
          <span className=" font-dm_sans text-siteHeadingDark font-semibold text-lg">
            Total Deposit
          </span>
          <span className="font-dm_sans text-siteHeadingDark font-bold text-2xl">
            {formatCurrency(totalDeposits)}
          </span>
        </div>
        <div className=" w-full flex flex-col gap-2 items-center">
          <span className="  font-dm_sans text-siteHeadingDark font-semibold text-lg">
            Total Withdrawal
          </span>
          <span className="font-dm_sans text-siteHeadingDark font-bold text-2xl">
            {formatCurrency(totalWithdrawals)}
          </span>
        </div>
      </div>
      <div className="sm:max-w-[800px] max-w-[400px] w-full flex sm:flex-row flex-col gap-4 items-center">
        <ModalBtn
          isLoading={deleteUserPending}
          isSuccess={deleteUserSuccess}
          bgColor="bg-red-500"
          btnText="Delete"
        >
          <DeleteCustomerById
            isLoading={deleteUserPending}
            userId={id as string}
            topupFn={deleteUser}
          />
        </ModalBtn>
        <ModalBtn
          isLoading={TopupFormPending}
          bgColor="bg-orange-500"
          btnText="Suspend"
        >
          <div className=" gap-5 w-full flex flex-col font-dm_sans items-center text-siteHeadingDark mt-6 ">
            <div className="flex flex-col items-center text-center">
              <p className=" text-3xl font-bold">Suspend This Customer</p>
              <span className=" text-siteHeadingDark/60">
                This action can be reversed
              </span>
            </div>
            <div className="flex gap-4 w-full max-w-[400px]">
              <button className=" rounded-xl px-5 py-3 bg-orange-500 text-white font-bold capitalize w-full">
                Yes, Suspend
              </button>
            </div>
          </div>
        </ModalBtn>
        <Link
          href={`/dashboard/user-investments/${id}`}
          className={clsx(
            " text-lg rounded-xl text-center px-6 py-3 font-dm_sans font-bold text-white w-full bg-green-500"
          )}
        >
          User Investments
        </Link>
      </div>
      <div className="w-full gap-3 items-center text-center justify-center max-w-[600px] grid grid-cols-[minmax(0,1fr)_minmax(200px,240px)_minmax(0,1fr)]">
        <span className="h-[1px] w-full bg-siteHeadingDark/25"></span>
        <span className=" text-xl font-bold font-dm_sans text-siteHeadingDark capitalize">
          Customer Transactions
        </span>
        <span className="h-[1px] w-full bg-siteHeadingDark/25"></span>
      </div>

      <div className="w-full block md:grid md:grid-rows-[minmax(50vh,80vh)] ">
        <UserTransactions transactions={transactions} />
      </div>
    </section>
  );
}

export default User;
