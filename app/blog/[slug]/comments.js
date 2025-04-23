"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";
import toast from "react-hot-toast";
import { commentAction } from "./action";

export function Comment({ postId, slug, currentUserId }) {
    const formRef = useRef(null);

    const commentSchema = z.object({
        comment: z.string().min(1, { message: "please write a comment" }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(commentSchema),
    });

    async function post(data) {
        try {
            const res = await commentAction(
                postId,
                data.comment,
                slug,
                currentUserId
            );
            if (res.success) {
                formRef.current?.reset();
                toast.success("comment added");
            }
        } catch (err) {
            throw err;
        }
    }

    return (
        <form
            onSubmit={handleSubmit(post)}
            ref={formRef}
            className="flex flex-col py-2 gap-[3px]"
        >
            <div className="flex items-center gap-[25px]">
                <input
                    {...register("comment")}
                    type="text"
                    placeholder="write a comment"
                    name="comment"
                    className="comment-input font-medium md:text-base text-sm focus:outline-none md:w-1/3"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white font-medium text-[13px] px-3 py-[7px] rounded-md disabled:text-gray-500"
                >
                    Add Comment
                </button>
            </div>

            <div className="text-[12px] text-red-500 pt-1">
                {errors.comment?.message && <p>{errors.comment?.message}</p>}
            </div>
        </form>
    );
}
