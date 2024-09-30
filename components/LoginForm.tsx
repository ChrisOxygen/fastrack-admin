"use client";

import { LoginErrorType } from "@/types";
import { login } from "@/utils/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";
import Image from "next/image";
import useFetchAdmin from "@/hooks/useFetchAdmin";

type LoginInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { session, isPending, isError, data } = useFetchAdmin();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<LoginInputs>({});

  const { mutate, isPending: submitFormPending } = useMutation({
    mutationFn: (data: LoginInputs) => {
      return login(data);
    },
    onError: (error) => {
      console.log("error", error);
      const { message } = error as { message: LoginErrorType };

      if (message === "Admin not found") {
        setError("email", {
          type: "manual",
          message: message,
        });
      } else if (message === "Invalid password") {
        setError("password", {
          type: "manual",
          message: message,
        });
      } else {
        setError("root", {
          type: "manual",
          message: message,
        });
      }
    },
    onSuccess: (data) => {
      console.log("data", data);
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log("onsubmit", data);

    mutate(data);
  };

  if (submitFormPending || isPending) {
    return <LoadingSpinner />;
  }

  if (session) {
    router.push("/dashboard");
  }

  return (
    <main className=" w-full  h-screen bg-white grid place-items-center">
      <div className=" w-full max-w-[400px] min-h-[400px] p-10 rounded-xl border border-gray-400 flex flex-col items-center ">
        <Link
          href="/"
          className="flex gap-2 text-center font-syne text-xl font-bold mb-4"
        >
          <Image
            src="/fastrack-black.png"
            alt="fastrack"
            width={200}
            height={10}
          />
        </Link>
        <section className=" w-full flex flex-col items-center gap-2 font-dm_sans text-black">
          <p className=" text-4xl font-bold">Welcome Back!</p>
          <span className=" mb-4">Log in to continue.</span>
          <form action="" className=" flex w-full flex-col gap-3">
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="email" className=" font-bold capitalize">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className=" w-full px-3 py-2 border border-gray-400 rounded-md text-siteHeadingDark"
                {...register("email", { required: "This field is required" })}
              />
              {errors.email && (
                <span className=" italic text-red-500 self-end mt-[-5px] mr-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="password" className=" font-bold capitalize">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-400 rounded-md text-siteHeadingDark"
                {...register("password", {
                  required: "This field is required",
                })}
              />
              {errors.password && (
                <span className=" italic text-red-500 self-end mt-[-5px] mr-1">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-3 mt-4 py-2 w-full rounded-md bg-siteHeadingDark text-white text-xl capitalize font-bold"
              onClick={(e) => {
                console.log("clicked");
                e.preventDefault();
                handleSubmit(onSubmit)();
              }}
            >
              Log in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginForm;
