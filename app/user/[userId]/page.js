import FollowUnfollowComponent from "@/app/(components)/followUnfollowComponent";
import { decrypt } from "@/app/(lib)/sessions";
import BlogCard from "@/app/blogCard";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

export default async function User({ params }) {
    const currentUser =
        (await decrypt(cookies().get("session")?.value)) || null;

    const prisma = new PrismaClient();

    const user = await prisma.user.findFirst({
        where: {
            id: params.userId,
        },
        select: {
            id: true,
            email: true,
            name: true,
            posts: true,
            gender: true,
            // followers: {
            //     select: {
            //         followedBy: {
            //             include: {
            //                 password: false,
            //             },
            //         },
            //     },
            // },
            // following: {
            //     select: {
            //         following: {
            //             include: {
            //                 password: false,
            //             },
            //         },
            //     },
            // },
            _count: {
                select: {
                    posts: true,
                    followers: true,
                },
            },
        },
    });

    const posts = await prisma.post.findMany({
        where: {
            authorId: user.id,
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

    const isFollowing = currentUser.success
        ? await prisma.follows.findFirst({
              where: {
                  followedById: currentUser.id,
                  followingId: user.id,
              },
          })
        : false;

    return (
        <div className="w-[90%] md:w-[70%] mx-auto">
            <div className="flex items-center gap-5 my-10">
                <img
                    src={
                        user.gender == "male"
                            ? `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=shortCombover&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                            : `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=bobBangs,bobCut,extraLong,long&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                    }
                    className="w-[80px] rounded-full"
                />
                <div className="flex flex-col gap-2">
                    <div>
                        {currentUser?.id != user?.id ? (
                            <FollowUnfollowComponent
                                user={user}
                                redirect={`/user/${user.id}`}
                                followStatus={isFollowing}
                                currentUser={currentUser}
                            />
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="text-sm font-medium">
                        {user.name} have posted {user._count.posts} blogs
                    </div>
                </div>
            </div>

            <div className="mb-5 pl-2">
                <div className=" ml-0 mt-3 h-auto">
                    <div className="mb-3 text-gray-400 font-semibold text-sm">
                        posts by {user.name}
                    </div>
                    {posts.length != 0 ? (
                        posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <BlogCard post={post} />
                            </Link>
                        ))
                    ) : (
                        <div className="py-14 flex flex-col items-center justify-center gap-3">
                            <MdErrorOutline size={"1.5em"} color="#9ca3af" />
                            <div className="text-sm font-medium text-gray-400">
                                {`oops! ${user.name} didn't posted anything yet`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
