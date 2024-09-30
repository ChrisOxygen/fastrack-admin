import React from "react";

type DeleteCustomerByIdProps = {
  topupFn: (data: { userId: string }) => void;
  userId: string;
  isLoading: boolean;
};

function DeleteCustomerById({
  topupFn,
  userId,
  isLoading,
}: DeleteCustomerByIdProps) {
  return (
    <div className=" gap-5 w-full flex flex-col font-dm_sans items-center text-siteHeadingDark mt-6 ">
      <div className="flex flex-col items-center text-center">
        <p className=" text-3xl font-bold">Delete This Customer</p>
        <span className=" text-siteHeadingDark/60">
          This action cannot be reversed
        </span>
      </div>
      <div className="flex gap-4 w-full max-w-[400px]">
        <button
          onClick={() => {
            topupFn({ userId });
          }}
          className=" rounded-xl px-5 py-3 bg-red-500 text-white font-bold capitalize w-full"
        >
          Delete Forever
        </button>
      </div>
    </div>
  );
}

export default DeleteCustomerById;
