"use client";

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
import { completeInvestment } from "@/lib/actions/investment.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import LoadingSpinner from "./LoadingSpinner";

import { useRouter } from "next/navigation";

type CompleteTransactionDialogProps = {
  buttonTitle: string;
  initialReturns: number;
  amount: number;
  investmentId: string;
};

const formSchema = z.object({
  returns: z.coerce.number(),
});

function CompleteTransactionDialog({
  buttonTitle,
  initialReturns,
  amount,
  investmentId,
}: CompleteTransactionDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending: completeInvestmentPending } = useMutation({
    mutationFn: (data: { id: string; finalReturns: number }) => {
      console.log("mutation data", data);
      return completeInvestment(data);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log("data", data);
      queryClient.invalidateQueries({
        queryKey: ["customer", "investment"],
      });
      router.refresh();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      returns: initialReturns,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      id: investmentId,
      finalReturns: values.returns,
    });
  }

  if (completeInvestmentPending) {
    return <LoadingSpinner />;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" rounded-xl flex shrink-0 bg-green-500 font-dm_sans text-white uppercase font-semibold px-4 py-2 ">
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center w-full"
          >
            <FormField
              control={form.control}
              name="returns"
              render={({ field }) => (
                <>
                  <FormItem className=" w-full flex flex-col items-center">
                    <FormLabel className="text-2xl font-bold text-siteHeadingDark text-center">
                      Add ROI amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        className=" w-full appearance-none"
                        type="number"
                        placeholder="$300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />

            <Button className="w-full" type="submit">
              Complete Investment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CompleteTransactionDialog;
