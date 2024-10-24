"use client";

import ErrorHandler from "@/components/ErrorHandler";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetchCustomer from "@/hooks/useFetchCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNewTransaction } from "@/lib/actions/transaction.actions";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { formatCurrency } from "@/utils/tools";

const formSchema = z.object({
  amount: z.coerce.number(),

  transactionType: z.string({
    message: "Must be a valid transaction type.",
  }),
});

function AddToBalancePage() {
  const { id } = useParams();
  const router = useRouter();

  const { isPending, isError, data, error } = useFetchCustomer(id as string);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      transactionType: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form values", values, "id==========", id);

    mutate({
      amount: values.amount,
      userId: id as string,
      type: values.transactionType,
    });
  }

  const { mutate, isPending: TopupFormPending } = useMutation({
    mutationFn: (data: { amount: number; userId: string; type: string }) => {
      console.log("mutation data", data);
      return createNewTransaction(data);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  if (isPending || TopupFormPending) {
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
    <div className=" h-full w-full relative items-center flex flex-col flex-grow gap-5">
      <button
        className=" absolute  right-4 top-4 text-2xl"
        onClick={() => router.back()}
      >
        <FiX />
      </button>
      <div className=" max-w-[600px] w-full gap-5 flex flex-col">
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
      </div>
      <div className="max-w-[600px] w-full ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center w-full"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <>
                  <FormItem className=" w-full flex flex-col items-center">
                    <FormLabel className="text-2xl font-bold text-siteHeadingDark text-center">
                      How much would you like to add?
                    </FormLabel>
                    <FormControl>
                      <Input
                        className=" w-full appearance-none"
                        type="number"
                        placeholder="$300"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deposit">deposit</SelectItem>
                        <SelectItem value="trade-profit">
                          trade profit
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddToBalancePage;
