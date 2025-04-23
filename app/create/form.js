"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    createPostAction,
    createSlug,
    doTitleExist,
    uploadImage,
} from "./action";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Tiptap } from "../(lib)/tiptap";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaImage } from "react-icons/fa6";
import Placeholder from "@tiptap/extension-placeholder";
import { MdOutlinePostAdd } from "react-icons/md";

export default function CreateForm({ currentUser }) {
    const router = useRouter();

    const [img, setImg] = useState(null);
    const [imgErr, setImgErr] = useState("");
    const [contentErr, setContentErr] = useState("");

    //zod schema for form
    const postSchema = z.object({
        title: z.string().min(1, { message: "please enter the title" }),
        category: z.string().min(1, { message: "please select category" }),
        description: z
            .string()
            .max(210, {
                message: "description shouldn't be more than 200 characters.",
            })
            .min(1, { message: "please enter description" }),
    });

    //assigning zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(postSchema) });

    //function to post data to database
    async function post(data) {
        setImgErr("");
        setContentErr("");

        if (!img) {
            setImgErr("please choose a cover photo");
            return;
        }
        if (editor?.isEmpty) {
            setContentErr("please write your blog");
            return;
        }

        const titleExist = await doTitleExist(data.title);

        const loadingToast = toast.loading("please wait...");
        if (!titleExist) {
            const imageData = new FormData();
            imageData.append("image", img);
            const image = await uploadImage(imageData);
            if (!image.success) {
                toast.dismiss(loadingToast);
                toast(image.message, {
                    icon: "😐",
                });
                return;
            }
            const postData = {
                title: data.title,
                description: data.description,
                content: editor?.getHTML(),
                category: data.category,
                image: image.url,
                imageId: image?.publicId,
                slug: await createSlug(data.title),
            };

            const result = await createPostAction(postData, currentUser.id);
            toast.dismiss(loadingToast);
            if (!result.success) {
                toast.error(result.message);
            } else {
                toast.success("created sucessfully");
                router.push(`/blog/${postData.slug}?c=true`);
            }
        } else {
            toast.dismiss(loadingToast);
            toast("title already exists, try a unique title", {
                icon: "😐",
            });
        }
    }

    //tiptap rich text editor config
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: "write something...",
            }),
        ],
        content: "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "text-area prose prose-sm focus:outline-none !max-w-none",
            },
        },
    });

    //jsx form
    return (
        <div className="h-[94svh] flex flex-col items-center">
            <div className="w-[95%] md:w-[67.5%] pt-6 pb-4 text-[22px] font-semibold text-[#333333]">
                Start writing your blog..
            </div>

            <form
                onSubmit={handleSubmit(post)}
                className="w-[95%] md:w-[68%] flex flex-col gap-2 h-full justify-evenly"
            >
                {/* title input field */}
                <div className="flex flex-col gap-2">
                    <input
                        {...register("title")}
                        type="text"
                        placeholder="Title..."
                        className="border-b-2 w-[100%] focus:outline-none text-xl font-medium px-2 py-1"
                    />
                    <div>
                        {errors.title?.message && (
                            <p className="text-red-400 font-medium text-xs px-1">
                                {errors.title?.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        {...register("description")}
                        type="text"
                        placeholder="description..."
                        className="border-b-2 w-[100%] focus:outline-none text-[13px] font-medium px-2 py-1"
                    />
                    <div>
                        {errors.description?.message && (
                            <p className="text-red-400 font-medium text-xs px-1">
                                {errors.description?.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* select field and image input tag*/}
                <div className="md:flex gap-9 text-sm font-medium py-2">
                    <div className="w-[75%] md:w-[20%] flex flex-col gap-2">
                        <select
                            {...register("category")}
                            id="drop"
                            className="border-b-2 w-full pl-2 pb-2 pt-2 md:pt-1 bg-none text-medium font-medium text-gray-500 focus:outline-none"
                        >
                            <option value="">select category</option>
                            <option value="Coding">Coding</option>
                            <option value="Science">Science</option>
                            <option value="Tutorials">Tutorials</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Nature">Nature</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Personal care">Personal care</option>
                        </select>

                        <div>
                            {errors.category?.message && (
                                <p className="text-red-400 font-medium text-xs px-1">
                                    {errors.category?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-2 pt-5 sm:pt-0">
                        <div className="flex items-center">
                            <FaImage size={"1.1em"} />
                            <input
                                {...register("image")}
                                type="file"
                                name="image"
                                className="font-medium text-slate-500 file:py-2 hover:file:bg-slate-200 file:px-4 file:mx-4 file:rounded-full file:border-0 file:text-sm file:font-medium"
                                onChange={(e) => setImg(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>
                        <div>
                            {imgErr && (
                                <p className="text-red-400 font-medium text-xs pt-2 pl-1">
                                    {imgErr}*
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* rich tect editor */}
                <div className="w-[100%] flex flex-col gap-2">
                    <Tiptap editor={editor} />
                    <div className="px-1">
                        {contentErr && (
                            <p className="text-red-400 font-medium text-xs">
                                {contentErr}*
                            </p>
                        )}
                    </div>
                </div>

                <div className="pb-5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white text-sm font-medium px-5 py-2 rounded-lg disabled:cursor- disabled:text-slate-300 flex gap-2 items-center"
                    >
                        <MdOutlinePostAdd size={"1.2em"} />
                        Add Blog
                    </button>
                </div>
            </form>
        </div>
    );
}
