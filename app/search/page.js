import { redirect } from "next/navigation";
import prisma from "../(lib)/prisma";
import { MdSearch } from "react-icons/md";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Link from "next/link";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import Timeago from "../(lib)/timeago";
import BlogCard from "../blogCard";

export default async function Search({ searchParams }) {
    let data;
    const searchString = searchParams.query || "";

    const currentPage = searchParams.page || 1;
    const postsPerPage = 3;
    const lastPost = currentPage * postsPerPage;
    const startPost = lastPost - postsPerPage;

    if (currentPage <= 0) {
        redirect(`/search?query=${searchString}&page=1`);
    }

    if (searchString != "") {
        data = await prisma.post.findMany({
            where: {
                title: {
                    contains: searchString,
                    mode: "insensitive",
                },
            },
            select: {
                title: true,
                description: true,
                image: true,
                category: true,
                slug: true,
                createdAt: true,
                author: {
                    include: {
                        password: false,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        //query for fuzzy searching inputstring
        // data = await prisma.post.aggregateRaw({
        //     pipeline: [
        //         {
        //             $search: {
        //                 index: "default",
        //                 text: {
        //                     query: searchString,
        //                     path: ["title", "description"],
        //                     fuzzy: {
        //                         maxEdits: 2,
        //                         prefixLength: 2,
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             $lookup: {
        //                 from: "User",
        //                 localField: "authorId",
        //                 foreignField: "_id",
        //                 as: "author",
        //                 pipeline: [
        //                     {
        //                         $project: {
        //                             password: false,
        //                             _id: false,
        //                         },
        //                     },
        //                 ],
        //             },
        //         },
        //     ],
        // });
    }

    const totalPages = Math.ceil(data?.length / postsPerPage) || 1;
    if (currentPage > totalPages) {
        redirect(`/search?query=${searchString}&page=${totalPages}`);
    }

    const result = data?.slice(startPost, lastPost);

    async function getData(formData) {
        "use server";
        if (formData.get("search") == "") {
            return;
        }
        redirect(`/search?query=${formData.get("search")}&page=${currentPage}`);
    }

    async function nextPage() {
        "use server";
        const nextPageNumber = parseInt(currentPage) + 1;
        if (nextPageNumber >= totalPages) {
            redirect(`/search?query=${searchString}&page=${totalPages}`);
        }
        redirect(`/search?query=${searchString}&page=${nextPageNumber}`);
    }

    async function prevPage() {
        "use server";
        const prevPageNumber = parseInt(currentPage) - 1;
        redirect(`/search?query=${searchString}&page=${prevPageNumber}`);
    }

    return (
        <div className="flex flex-col md:w-[75%] sm:w-[98%] w-[95%] mx-auto gap-4">
            {/* search-box */}
            <form
                action={getData}
                className="flex items-center justify-center gap-3 pt-8 py-2"
            >
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    defaultValue={searchString}
                    className="border-2 border-slate-300 rounded-3xl px-4 py-2 sm:w-[80%] w-[90%] focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-3xl"
                >
                    <MdSearch size={"1.4em"} />
                </button>
            </form>

            {/* result-posts area */}
            <div className="mb-3">
                {data?.length == 0 ? (
                    <p>no posts found</p>
                ) : (
                    result?.map(
                        (post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <BlogCard post={post} />
                            </Link>
                        )
                        // <Link href={`/blog/${post.slug}`} key={post.slug}>
                        //     <div className="mt-1 mb-3 flex flex-col item sm:flex-row gap-1 p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                        //         <div className="sm:h-56 h-52 sm:w-[40%] md:w-[36%] rounded-md">
                        //             <img
                        //                 src={post.image}
                        //                 alt=""
                        //                 className="w-full h-full object-cover rounded-md"
                        //             />
                        //         </div>

                        //         <div className="flex flex-col gap-1 mx-4 max-h-44 sm:max-h-52 sm:w-[77%]">
                        //             <div className="text-lg font-semibold pt-2">
                        //                 {post.title}
                        //             </div>
                        //             <div className="flex items-center mt-1 text-xs font-medium text-gray-500">
                        //                 <div>
                        //                     posted by @{post?.author[0].name}
                        //                 </div>

                        //                 <div className="mx-[6px]">
                        //                     <GoDotFill
                        //                         color="grey"
                        //                         size={"0.5em"}
                        //                     />
                        //                 </div>
                        //                 <div>
                        //                     <Timeago
                        //                         date={post?.createdAt.$date}
                        //                     />
                        //                 </div>
                        //             </div>
                        //             <div
                        //                 className="text-[12.5px] mt-1 mb-2 leading-5 truncate"
                        //                 dangerouslySetInnerHTML={{
                        //                     __html: post.description,
                        //                 }}
                        //             />
                        //             <div className="font-semibold text-[12px] mb-2">
                        //                 Read more..
                        //             </div>
                        //         </div>
                        //     </div>
                        // </Link>
                    )
                )}
            </div>

            {/* next-button and previous-button */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center sm:justify-end gap-3 pr-2 mb-8">
                    <form action={prevPage}>
                        <button
                            type="submit"
                            className="flex items-center rounded-md gap-1 text-[13px] font-medium bg-gray-100 px-2 py-1 disabled:text-gray-400"
                            disabled={currentPage == 1}
                        >
                            <GrFormPreviousLink size={"1.5em"} />
                            <p className="pr-2">Previous</p>
                        </button>
                    </form>
                    <div className="text-xs font-semibold text-gray-500 mx-2">
                        page {currentPage} of {totalPages}
                    </div>
                    <form action={nextPage}>
                        <button
                            type="submit"
                            className="flex items-center rounded-md gap-1 text-[13px] bg-gray-100 font-medium px-2 py-1 disabled:text-gray-400"
                            disabled={currentPage == totalPages}
                        >
                            <p className="pl-2">Next</p>
                            <GrFormNextLink size={"1.5em"} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
