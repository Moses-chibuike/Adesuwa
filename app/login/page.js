"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import loginAction from "./action";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || null;
    // this state is used to display weather is the user exists or the password is incorrect
    const [state, setState] = useState("");

    //zod schema for login form
    const schema = z.object({
        email: z.string().email({ message: "Please enter correct email" }),
        password: z
            .string()
            .min(6, { message: "password should contain atleast 6 character" }),
    });

    //useform for zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    //this is function called by submitting the form, this function will call a server function to create session for authenticated user
    async function post(data) {
        setState("");
        const loadingToast = toast.loading("please wait...");
        const res = await loginAction(data);
        if (!res.success) {
            toast.dismiss(loadingToast);
            toast.error(res.message);
        } else {
            if (redirect != null) {
                toast.dismiss(loadingToast);
                toast.success("redirecting...");
                router.push(redirect);
            } else {
                toast.dismiss(loadingToast);
                toast.success("login successfull");
                router.push("/");
            }
        }
    }

    //jsx logoin form
    return (
        <div className="w-full h-[94svh] flex justify-center bg-[#E0E0E0] items-center">
            <form
                onSubmit={handleSubmit(post)}
                className="flex flex-col gap-2 rounded-xl sm:w-[450px] w-[360px]  bg-white p-4 items-center py-10"
            >
                <div className="flex flex-col items-center font-semibold gap-2 py-6">
                    <p>Hey! Welcome</p>
                    <p>Login to your Account</p>
                </div>

                <div className="w-[90%] flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <input
                            {...register("email")}
                            type="text"
                            name="email"
                            placeholder="email"
                            className="text-field"
                            autoCapitalize="off"
                        />
                        {errors.email?.message && (
                            <div className="text-msg">
                                <p>{errors.email?.message}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <input
                            {...register("password")}
                            type="password"
                            name="password"
                            placeholder="password"
                            className="text-field mt-3"
                        />
                        {errors.password?.message && (
                            <div className="text-msg">
                                <p>{errors.password?.message}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-[90%] pb-6 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black mt-4 text-white font-bold disabled:text-gray-500 disabled:cursor-wait w-full rounded-lg h-10"
                    >
                        submit
                    </button>
                    <div className="w-[90%] text-sm p-1 pt-3">
                        Didn&apos;t have an account?{" "}
                        <Link href={"/signup"}>
                            <u>
                                <strong>Register here</strong>
                            </u>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
