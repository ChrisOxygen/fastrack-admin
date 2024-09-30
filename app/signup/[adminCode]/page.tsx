"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { SignupDataType } from "@/types";
import { signUpNewAdmin, validateAdminCode } from "@/utils/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type SignupInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
};

function Signup() {
  const { adminCode } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: validateCode, isPending } = useMutation({
    mutationFn: () => {
      return validateAdminCode(adminCode as string);
    },
    onError: (error) => {
      console.log("error", error);
      router.push("/signup");
    },
  });
  const { mutate: submitFormData, isPending: submitFormPending } = useMutation({
    mutationFn: (signupdata: SignupDataType) => {
      return signUpNewAdmin(signupdata);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (data) => {
      console.log("data", data);
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInputs>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      code: adminCode as string,
    },
  });

  useEffect(() => {
    if (adminCode) {
      validateCode();
    }
  }, [adminCode, validateCode]);

  const onSubmit: SubmitHandler<SignupInputs> = (data) => {
    console.log("onsubmit", data);
    const { fullName, email, password, code } = data;
    submitFormData({ fullName, email, password, code } as SignupDataType);
  };

  if (isPending || submitFormPending) {
    return <LoadingSpinner />;
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
        <form className=" flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="fullname" className=" font-bold capitalize">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Enter your email"
              className=" w-full px-3 py-2 border border-gray-400 rounded-md text-siteHeadingDark"
              {...register("fullName", {
                required: "This field is required",
              })}
            />
            {errors.fullName && (
              <span className=" italic text-red-500 self-end mt-[-5px] mr-1">
                {errors.fullName.message}
              </span>
            )}
          </div>
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
              {...register("password", { required: "This field is required" })}
            />
            {errors.password && (
              <span className=" italic text-red-500 self-end mt-[-5px] mr-1">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="confirmpassword" className=" font-bold capitalize">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-siteHeadingDark"
              {...register("confirmPassword", {
                required: "This field is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className=" italic text-red-500 self-end mt-[-5px] mr-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <input hidden {...register("code")} />

          <button
            className="px-3 py-2 w-full rounded-md bg-siteHeadingDark text-white text-xl capitalize font-bold mt-4"
            onClick={(e) => {
              console.log("clicked");
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            Sign up
          </button>
        </form>
      </div>
    </main>

    // <LoadingSpinner />
  );
}

export default Signup;
