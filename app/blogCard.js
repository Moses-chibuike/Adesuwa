"use client";
import { GoDotFill } from "react-icons/go";
import Timeago from "./(lib)/timeago";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import { useRouter } from "next/navigation";

export default function BlogCard({ post }) {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="cursor-pointer my-4 py-2 rounded-md flex sm:mr-3 hover:bg-[#f9f9f9] transition-all ease-in-out duration-300 sm:flex-row flex-col items-center sm:justify-center gap-3"
        >
            {/* image container 👇 */}
            <div className="w-[97%] sm:w-[29%] sm:ml-3 rounded-md overflow-hidden sm:h-[165px]">
                <img
                    src={post.image}
                    alt="cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 👇 this container shows the details of post and description */}
            <div className="w-full sm:w-[71%] pl-3 sm:pl-2 flex flex-col gap-2">
                <div className="max-h-14 text-lg font-semibold text-[#232b2b] overflow-hidden ">
                    {post.title}
                </div>

                <div className="sm:mr-20 line-clamp-2 pt-[2px] overflow-hidden text-[11.5px] font-medium leading-4 text-[#343434]">
                    {post.description}
                </div>

                <div className="text-[11.4px] font-medium pt-[2px] text-[#737373] flex items-center gap-[6px]">
                    <div className="flex">
                        <div className="rounded-[8px] px-3 py-1 text-[#444444] text-[10.5px] font-semibold bg-[#F2F2F2]">
                            {post.category}
                        </div>
                    </div>

                    <GoDotFill size={"0.6em"} />

                    <span>
                        Posted by{" "}
                        <span className="font-semibold text-[#4f4f4f]">
                            {post.author.name}
                        </span>
                    </span>

                    <GoDotFill size={"0.6em"} />

                    <Timeago date={post.createdAt} />
                </div>

                <div className="flex gap-3 items-center text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                        <div className="bg-red-100 p-[5px] rounded-full">
                            <CiHeart color="#FF0808" size={"0.8em"} />
                        </div>
                        <div className="text-[10px] font-semibold">
                            {post._count.likes}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="bg-green-100 p-[5px] rounded-full">
                            <GoComment size={"0.9em"} color="green" />
                        </div>
                        <div className="text-[10px] font-semibold">
                            {post._count.comments}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
