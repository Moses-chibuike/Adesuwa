import { redirect } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { decrypt } from "./(lib)/sessions";
import { cookies } from "next/headers";
import BlogCard from "./blogCard";
import UserCard from "./userCard";
import { Suspense } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default async function Home() {
    const currentUser = await decrypt(cookies().get("session")?.value);

    const prisma = new PrismaClient();

    const postsFromFollowing = currentUser.success
        ? await prisma.post.findMany({
              where: {
                  author: {
                      followers: {
                          some: {
                              followedById: currentUser.id,
                          },
                      },
                  },
              },
              orderBy: {
                  createdAt: "desc",
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
          })
        : [];

    const postsFromRemaining = currentUser.success
        ? await prisma.post.findMany({
              where: {
                  author: {
                      followers: {
                          none: {
                              followedById: currentUser.id,
                          },
                      },
                  },
              },
              orderBy: {
                  createdAt: "desc",
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
          })
        : [];

    const totalPosts = [...postsFromFollowing, ...postsFromRemaining];

    const allposts = !currentUser.success
        ? await prisma.post.findMany({
              orderBy: {
                  createdAt: "desc",
              },
              take: 6,
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
          })
        : totalPosts;

    const TopUserstoFollow = currentUser.success
        ? await prisma.user.findMany({
              where: {
                  NOT: {
                      followers: {
                          some: {
                              followedById: currentUser.id,
                          },
                      },
                  },
                  id: {
                      not: currentUser.id,
                  },
              },
              take: 4,
              select: {
                  id: true,
                  name: true,
                  email: true,
                  gender: true,
                  _count: {
                      select: { followers: true },
                  },
              },
              orderBy: {
                  followers: {
                      _count: "desc",
                  },
              },
          })
        : null;

    // Featured posts for slider
    const featuredPosts = [
        {
            id: 1,
            title: "The Art of Mindful Living",
            description: "Discover how mindfulness can transform your daily life experiences.",
            category: "Lifestyle",
            image: "https://images.unsplash.com/photo-1679609985650-fb1ea9d9015d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            slug: "the-art-of-mindful-living",
            author: { name: "Emma Johnson" }
        },
        {
            id: 2,
            title: "Future of Remote Work",
            description: "How remote work is reshaping corporate culture and work-life balance.",
            category: "Career",
            image: "https://images.unsplash.com/photo-1688302662935-0dbcff7fe8e9?q=80&w=1554&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            slug: "future-of-remote-work",
            author: { name: "Michael Chen" }
        },
        {
            id: 3,
            title: "Sustainable Living Guide",
            description: "Simple steps to reduce your carbon footprint and live more sustainably.",
            category: "Environment",
            image: "https://images.unsplash.com/photo-1737649507334-92c9fa4beb7c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            slug: "sustainable-living-guide",
            author: { name: "Sarah Peterson" }
        }
    ];

    async function search(formData) {
        "use server";
        redirect(`/search?query=${formData.get("search")}`);
    }

    return (
        <div className="w-full pt-[35px] mx-auto flex flex-col min-h-[94svh]">
            {/* Hero Slider Section */}
            <div className="w-[95%] mx-auto mb-10">
                <div className="relative overflow-hidden rounded-2xl h-[400px] shadow-lg">
                    <div className="flex flex-nowrap h-full transition-transform duration-700" id="slider-container">
                        {featuredPosts.map((post, index) => (
                            <div key={post.id} className="min-w-full h-full relative" id={`slide-${index}`}>
                                <div 
                                    className="absolute inset-0 bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${post.image})` }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-blue-600 rounded-full">{post.category}</div>
                                    <h2 className="mb-2 text-3xl font-bold">{post.title}</h2>
                                    <p className="mb-4 text-lg">{post.description}</p>
                                    <div className="flex items-center text-sm">
                                        <span>By {post.author.name}</span>
                                        <Link href={`/post/${post.slug}`}>
                                            <span className="ml-auto px-4 py-2 font-medium bg-white text-black rounded-md hover:bg-opacity-90">Read Article</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Slider Controls - Now without onClick handlers */}
                    <button 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full"
                        id="prev-slide"
                    >
                        <MdChevronLeft size="1.5em" />
                    </button>
                    <button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full"
                        id="next-slide"
                    >
                        <MdChevronRight size="1.5em" />
                    </button>
                    
                    {/* Slider Indicators - Now without onClick handlers */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {featuredPosts.map((_, index) => (
                            <button 
                                key={index}
                                className="w-2 h-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                                id={`indicator-${index}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-[95%] mx-auto grid md:grid-cols-[5fr,2fr] gap-6">
                {/* 🔴 left section */}
                <div className="md:pl-10 mb-5">
                    <form
                        action={search}
                        className="bg-[#F4F4F4] sm:w-[60%] rounded-2xl grid grid-cols-[8fr,1fr]"
                    >
                        <input
                            type="text"
                            name="search"
                            placeholder="Search Blogs..."
                            className="focus:outline-none bg-[#F4F4F4] ml-4 px-2 py-[12px] text-sm font-medium text-gray-600"
                        />
                        <button
                            type="submit"
                            className="rounded-[28px] flex items-center justify-center"
                        >
                            <MdSearch size={"1.2em"} />
                        </button>
                    </form>

                    {/* for mobile view */}
                    {!currentUser.success && (
                        <div className="rounded-3xl mt-5 px-5 pb-4 flex flex-col gap-3 md:hidden">
                            <div className="font-semibold text-[20px]">
                                Create & Connect
                            </div>
                            <div className="text-[13.5px] font-medium">
                                LogIn your account to share your thoughts and engage
                                with community.
                            </div>
                            <div className="flex gap-3 text-xs font-medium text- items-center pt-1">
                                <Link href={"/login"}>
                                    <div className="rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                        Login
                                    </div>
                                </Link>

                                <Link href={"/signup"}>
                                    <div className=" rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                        SignUp
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pl-2">
                        <div className="flex gap-2 items-end">
                            <span className="text-2xl font-semibold">Blogs</span>
                            <span className="font-semibold text-sm text-[#6C6C6C]">
                                for you
                            </span>
                        </div>
                    </div>

                    <div className="ml-0 mt-3 h-auto">
                        <div className="pl-3 pt-2 mb-3 text-gray-400 font-semibold text-sm">
                            Recent activity
                        </div>

                        {allposts.length != 0 ? (
                            allposts.map((post, i) => (
                                <BlogCard post={post} key={i} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No posts available</div>
                        )}
                    </div>
                </div>

                {/* 👇 right side section 👇  */}
                <div className="py-2 flex flex-col sm:flex-row md:flex-col sm:items-center gap-3">
                    {/* Category Slider */}
                    <div className="w-full mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        <h3 className="px-4 py-3 font-semibold text-lg border-b">Popular Categories</h3>
                        <div className="p-4 flex overflow-x-auto gap-3 pb-6">
                            {["Tech", "Travel", "Food", "Lifestyle", "Health", "Business"].map((category, i) => (
                                <Link href={`/category/${category.toLowerCase()}`} key={i}>
                                    <div className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                        {category}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {TopUserstoFollow?.length > 0 && (
                        <div className="flex flex-col gap-2 pb-4 w-full bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-4 py-3 font-semibold text-lg border-b">
                                Suggested People
                            </div>

                            <div className="flex flex-col gap-2 px-4 py-2">
                                {TopUserstoFollow.map((user, i) => (
                                    <UserCard
                                        user={user}
                                        currentUserId={currentUser.id}
                                        key={i}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {!currentUser.success && (
                        <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden p-5 flex flex-col gap-3 max-md:hidden">
                            <div className="font-semibold text-[20px]">
                                Create & Connect
                            </div>
                            <div className="text-[13.5px] font-medium">
                                LogIn your account to share your thoughts and engage
                                with community.
                            </div>
                            <div className="flex gap-3 text-xs font-medium text- items-center pt-1">
                                <Link href={"/login"}>
                                    <div className="rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                        Login
                                    </div>
                                </Link>

                                <Link href={"/signup"}>
                                    <div className=" rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                        SignUp
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="w-full h-[250px] my-2 md:h-[300px] rounded-xl shadow-sm overflow-hidden bg-[#f5f5f5] flex flex-col gap-3 justify-center p-6">
                        <div className="flex flex-col text-[19px] font-semibold gap-[3px]">
                            <div>Share your thoughts,</div>
                            <div>Inspire the world</div>
                        </div>
                        <div className="font-medium text-[#707070] text-[13px]">
                            Our story matters. Start writing your blog today and let
                            your thoughts make an impact.
                        </div>

                        <div className="flex">
                            <Link href={"/create"}>
                                <div className="border-2 rounded-md text-sm font-semibold bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                    📝 write
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Script for slider functionality */}
            <script dangerouslySetInnerHTML={{ __html: `
                document.addEventListener('DOMContentLoaded', function() {
                    const sliderContainer = document.getElementById('slider-container');
                    let currentSlide = 0;
                    
                    // Function to update slide
                    function goToSlide(slideIndex) {
                        currentSlide = slideIndex;
                        sliderContainer.style.transform = "translateX(-" + currentSlide * 100 + "%)";
                    }
                    
                    // Auto slide every 5 seconds
                    const autoSlideInterval = setInterval(function() {
                        currentSlide = (currentSlide + 1) % 3; // 3 is the number of slides
                        goToSlide(currentSlide);
                    }, 5000);

                    // Add event listeners for prev/next buttons
                    document.getElementById('prev-slide').addEventListener('click', function() {
                        currentSlide = (currentSlide - 1 + 3) % 3;
                        goToSlide(currentSlide);
                        clearInterval(autoSlideInterval);
                    });
                    
                    document.getElementById('next-slide').addEventListener('click', function() {
                        currentSlide = (currentSlide + 1) % 3;
                        goToSlide(currentSlide);
                        clearInterval(autoSlideInterval);
                    });
                    
                    // Add event listeners for indicators
                    for (let i = 0; i < 3; i++) {
                        document.getElementById("indicator-" + i).addEventListener('click', function() {
                            goToSlide(i);
                            clearInterval(autoSlideInterval);
                        });
                    }
                });
            `}} />
        </div>
    );
}