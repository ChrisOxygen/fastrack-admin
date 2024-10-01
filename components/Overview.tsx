import { TransactionType, UserData } from "@/types";
import { formatCurrency } from "@/utils/tools";
import Link from "next/link";
import { FiCreditCard, FiUsers } from "react-icons/fi";

type OverviewProps = {
  data: UserData;
};

function Overview({ data }: OverviewProps) {
  const allUsers = data.users;
  const allTransactions = data.transactions;

  const totalBalace = allUsers.reduce(
    (acc: number, user: any) => acc + user.balance,
    0
  );
  const pendingTransactionsCount = allTransactions.filter(
    (transaction: any) => transaction.status === "pending"
  ).length;
  const totalDeposits = allTransactions.reduce(
    (acc: number, transaction: TransactionType) => {
      if (transaction.type === "deposit" && transaction.status === "success") {
        return acc + transaction.amount;
      } else {
        return acc;
      }
    },

    0
  );
  const pendingDeposits = allTransactions.filter(
    (transaction: any) =>
      transaction.type === "deposit" && transaction.status === "pending"
  ).length;

  const totalUsers = allUsers.length;

  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  const newUsers = allUsers.filter((user) => {
    const signupDate = new Date(user.createdAt);
    return signupDate >= thirtyDaysAgo && signupDate <= currentDate;
  }).length;
  return (
    <div className="w-full  grid grid-cols-1 xsm:grid-cols-2 grid-rows-[max-content_max-content_max-content] xsm:grid-rows-2 sm:grid-rows-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div className="border border-siteHeadingDark/25 rounded-xl p-4 xsm:col-span-2 flex flex-col gap-2 font-dm_sans text-siteHeadingDark">
        <span className="text-siteHeadingDark/40">Total Balance</span>
        <span className="text-2xl font-bold">
          {formatCurrency(totalBalace)}
        </span>
        <p className=" font-semibold">
          <span className="text-siteGreen underline">
            {pendingTransactionsCount}
          </span>{" "}
          pending transactions.
        </p>
        <div className="flex flex-col xsm:flex-row gap-4 w-full mt-3">
          <Link
            href="/dashboard/pending"
            className="bg-siteHeadingDark text-center flex justify-center rounded-lg px-4 py-3 text-white font-semibold w-full"
          >
            View Pending
          </Link>
          <Link
            href="/dashboard/transactions"
            className="bg-siteHeadingDark/10 text-center flex justify-center rounded-lg px-4 py-3 text-siteHeadingDark font-semibold w-full"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="border text-siteHeadingDark border-siteHeadingDark/25 rounded-xl p-4 flex flex-col gap-2 items-start">
        <span className=" p-4 rounded-full border border-green-500 text-green-500 text-2xl">
          <FiCreditCard />
        </span>
        <span className=" text-siteHeadingDark text-xl font-semibold">
          Deposits
        </span>
        <span className="text-2xl font-bold">
          {formatCurrency(totalDeposits)}
        </span>
        <p className=" font-semibold">
          <span className="text-green-500 underline">{pendingDeposits}</span>{" "}
          pending deposit.
        </p>
      </div>
      <div className="border lg:flex flex-col items-start flex sm:hidden border-siteHeadingDark/25 rounded-xl p-4 gap-2">
        <span className=" p-4 rounded-full border border-orange-500 text-orange-500 text-2xl">
          <FiUsers />
        </span>
        <span className=" text-siteHeadingDark text-xl font-semibold">
          Registered Users
        </span>
        <span className="text-2xl font-bold">{totalUsers} Users</span>
        <p className=" font-semibold">
          <span className="text-orange-500 underline">{newUsers}</span> new
          users.
        </p>
      </div>
    </div>
  );
}

export default Overview;
