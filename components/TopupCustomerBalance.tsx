import React from "react";
import { SubmitHandler, useForm, ValidateResult } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

type Inputs = {
  amount: number;
};

type TopupCustomerBalanceProps = {
  topupFn: (data: { amount: number; userId: string }) => void;
  userId: string;
  isLoading: boolean;
};

function TopupCustomerBalance({
  topupFn,
  userId,
  isLoading,
}: TopupCustomerBalanceProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { amount } = data;

    topupFn({ amount: +amount, userId });
  };

  return (
    <div className=" relative gap-5 w-full flex flex-col font-dm_sans items-center text-siteHeadingDark mt-6 ">
      {isLoading && <SmallLoadingSpinner />}
      <div className="flex flex-col items-center text-center">
        <p className=" text-3xl font-bold">Top up User Balance</p>
        <span className=" text-siteHeadingDark/60">
          Enter the amount you&apos;d like to add
        </span>
      </div>
      <form className="flex flex-col gap-4 w-full max-w-[400px]">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            {...register("amount", {
              validate: (value) => {
                if (+value <= 4000) {
                  return true as ValidateResult;
                } else {
                  return "Amount must not be more than 4000" as ValidateResult;
                }
              },
            })}
            id=""
            className="rounded-xl text-siteHeadingDark font-bold text-2xl border-2 border-siteHeadingDark/30 p-3"
          />
          {errors.amount && (
            <span className=" text-red-500 self-end">
              {errors.amount.message}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
          className=" rounded-xl px-5 py-3 bg-green-500 text-white font-bold capitalize w-full"
        >
          Add ${watch("amount") ? watch("amount") : "0"} to user balance
        </button>
      </form>
    </div>
  );
}

export default TopupCustomerBalance;
