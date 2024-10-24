import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveTransaction } from "@/lib/actions/transaction.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSpinner from "./LoadingSpinner";

type ApproveTransactionProps = {
  transactionId: string;
  amount: number;
};

const formSchema = z.object({
  amount: z.coerce.number(),
});

export default function ApproveTransaction({
  transactionId,
  amount,
}: ApproveTransactionProps) {
  const queryClient = useQueryClient();
  const { mutate: executeTransaction, isPending } = useMutation({
    mutationFn: (payload: { transactionId: string; amount: number }) => {
      return approveTransaction(payload);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log(" success data", data);
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: amount,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form values", values);

    executeTransaction({
      amount: values.amount,
      transactionId,
    });
  }

  if (isPending) {
    return <LoadingSpinner />;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="grid w-full place-items-center rounded-xl bg-green-600 px-6 py-3 font-dm_sans text-lg font-bold text-white h-full">
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Transaction</DialogTitle>
          <DialogDescription>
            Make sure you enter the exactamount reflected in the admins account.
          </DialogDescription>
        </DialogHeader>
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
                      Amount
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

            <Button type="submit">Approve</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
