"use client";

import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

import {
  completeInvestment,
  getInvestment,
} from "@/lib/actions/investment.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";

import { Button } from "@/components/ui/button";

const formSchema = z.object({
  returns: z.coerce.number(),
});

function CompleteIvestmentPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["investmenmt", "customer"],
    queryFn: () => getInvestment(id as string),
  });

  const { returns: initialReturns, user: userId } = data!;

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
      router.push(`/dashboard/investments/${id}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      returns: initialReturns,
    },
  });
  if (completeInvestmentPending || isPending) {
    return <LoadingSpinner />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      id: id as string,
      finalReturns: values.returns,
    });
  }

  return (
    <section className=" w-full max-w-[500px] p-5 border rounded-xl">
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
    </section>
  );
}

export default CompleteIvestmentPage;
