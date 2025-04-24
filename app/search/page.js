import { redirect } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Link from "next/link";
import BlogCard from "../blogCard";

// This is a crucial change - using dynamic rendering 
// to prevent build-time database access
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Search({ searchParams }) {
    const searchString = searchParams.query || "";
    const currentPage = parseInt(searchParams.page) || 1;
    
    if (currentPage <= 0) {
        redirect(`/search?query=${searchString}&page=1`);
    }

    // Don't try to access database during build time
    // We'll fetch data only during runtime
    let data = [];
    let result = [];
    let totalPages = 1;
    
    // Only try to fetch data at runtime, not during build
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
        try {
            // Import prisma only if we're not in build
            const { default: prisma } = await import("../(lib)/prisma");
            
            if (searchString !== "") {
                data = await prisma.post.findMany({
                    where: {
                        title: {
                            contains: searchString,
                            mode: "insensitive",
                        },
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        image: true,
                        category: true,
                        slug: true,
                        createdAt: true,
                        author: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
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
            }
            
            const postsPerPage = 3;
            totalPages = Math.ceil(data.length / postsPerPage) || 1;
            
            if (data.length > 0 && currentPage > totalPages) {
                redirect(`/search?query=${searchString}&page=${totalPages}`);
            }
            
            const lastPost = currentPage * postsPerPage;
            const startPost = lastPost - postsPerPage;
            result = data.slice(startPost, lastPost);
            
        } catch (error) {
            console.error("Error fetching search data:", error);
            data = [];
            result = [];
        }
    }

    async function getData(formData) {
        "use server";
        const search = formData.get("search");
        if (!search) {
            return;
        }
        redirect(`/search?query=${search}&page=1`);
    }

    async function nextPage() {
        "use server";
        const nextPageNumber = parseInt(currentPage) + 1;
        if (nextPageNumber > totalPages) {
            redirect(`/search?query=${searchString}&page=${totalPages}`);
        }
        redirect(`/search?query=${searchString}&page=${nextPageNumber}`);
    }

    async function prevPage() {
        "use server";
        const prevPageNumber = parseInt(currentPage) - 1;
        if (prevPageNumber < 1) {
            redirect(`/search?query=${searchString}&page=1`);
        }
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
                {result.length === 0 ? (
                    <p className="text-center py-8">
                        {searchString ? "No posts found" : "Enter a search term above"}
                    </p>
                ) : (
                    result.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id || post.slug}>
                            <BlogCard post={post} />
                        </Link>
                    ))
                )}
            </div>

            {/* next-button and previous-button */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center sm:justify-end gap-3 pr-2 mb-8">
                    <form action={prevPage}>
                        <button
                            type="submit"
                            className="flex items-center rounded-md gap-1 text-[13px] font-medium bg-gray-100 px-2 py-1 disabled:text-gray-400"
                            disabled={currentPage <= 1}
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
                            disabled={currentPage >= totalPages}
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