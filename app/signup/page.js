"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import signUpAction from "./action";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();

    const userSchema = z.object({
        email: z.string().email({ message: "enter a valid email id" }),
        name: z
            .string()
            .min(2, { message: "name should contain atleast 2 characters" }),
        password: z
            .string()
            .min(6, { message: "password should contain atleast 6 character" }),
        gender: z.string().min(1, { message: "please select gender" }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    async function post(data) {
        const loadingToast = toast.loading("please wait...");
        const res = await signUpAction(data);
        if (!res.success) {
            toast.dismiss(loadingToast);
            toast.error(res.message);
        } else {
            toast.dismiss(loadingToast);
            toast.success("user created sucessfully, redirecting..");
            router.push("/");
        }
    }

    //jsx signup form
    return (
        <div className="w-full h-[94svh] flex justify-center items-center bg-[#E0E0E0]">
            <form
                onSubmit={handleSubmit(post)}
                className="flex flex-col  rounded-xl sm:w-[450px] w-[360px] bg-white p-4 items-center"
            >
                <div className="flex flex-col items-center font-semibold gap-2 py-6">
                    <p>Hey! Welcome</p>
                    <p>create a new account here</p>
                </div>

                <div className="w-[89%] flex flex-col gap-4">
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
                            <p className="text-msg">{errors.email?.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <input
                            {...register("name")}
                            type="text"
                            name="name"
                            placeholder="name"
                            className="text-field"
                            autoCapitalize="off"
                        />
                        {errors.name?.message && (
                            <p className="text-msg">{errors.name?.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <select
                            {...register("gender")}
                            id="drop"
                            className="border-2 border-[gray] rounded-lg mt-[10px] w-full p-[9px] bg-none text-sm font-medium text-gray-400 focus:outline-none"
                        >
                            <option value="">select gender</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                        {errors.gender?.message && (
                            <p className="text-msg">{errors.gender?.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <input
                            {...register("password")}
                            type="password"
                            name="password"
                            placeholder="password"
                            className="text-field"
                            autoCapitalize="off"
                        />
                        {errors.password?.message && (
                            <p className="text-msg">
                                {errors.password?.message}
                            </p>
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

                    <div className="text-sm p-1 pt-4 ">
                        Already have an account?{" "}
                        <Link href={"/login"}>
                            <u>
                                <strong>Login here</strong>
                            </u>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
