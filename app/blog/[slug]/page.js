import { notFound } from "next/navigation";
import { Comment } from "./comments";
import { decrypt } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";
import Image from "next/image";
import DeleteButton from "./deleteButton";
import { GoDotFill } from "react-icons/go";
import Timeago from "../../(lib)/timeago";
import { TbFileSad } from "react-icons/tb";
import { MdLogin } from "react-icons/md";
import Link from "next/link";
import { AiTwotoneEdit } from "react-icons/ai";
import { TfiCommentAlt } from "react-icons/tfi";
import FollowUnfollowComponent from "@/app/(components)/followUnfollowComponent";
import ConfettiComponent from "./confettiComponent";
import prisma from "@/app/(lib)/prisma";
import LikeButton from "./likes";

export default async function Slug({ params }) {
    // Add fallback for when no session exists or during build time
    const sessionValue = cookies().get("session")?.value;
    const currentUser = sessionValue ? await decrypt(sessionValue) : { success: false, id: null };

    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            image: true,
            category: true,
            slug: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    password: false,
                    gender: true,
                    followers: currentUser.id ? {
                        where: {
                            followedById: currentUser.id,
                        },
                    } : undefined,
                    _count: {
                        select: {
                            followers: true,
                        },
                    },
                },
            },
            createdAt: true,
            isEdited: true,
            imageId: true,
            comments: {
                include: {
                    cmntAuthor: {
                        include: {
                            password: false,
                        },
                    },
                    cmntAuthorId: false,
                    id: false,
                    postId: false,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            likes: currentUser.id ? {
                where: {
                    likedById: currentUser.id,
                },
            } : undefined,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });

    if (post == null) {
        return notFound();
    }

    const comments = post.comments;

    // Safely check if user is following author
    const isFollowing =
        currentUser.success && post.author.followers?.length > 0
            ? true
            : false;

    // Safely check if post is liked by user
    const isLiked =
        currentUser.success && post.likes?.length > 0 ? true : false;

    return (
        <div className="sm:mx-[17%] md:mx-[19%] mx-4 flex flex-col mt-10 gap-1 ">
            <ConfettiComponent />

            <div className="text-[30px] md:text-[39px] font-semibold  text-start">
                {post.title}
            </div>

            <div className="font-medium text-[13.5px] leading-7 mb-5 mt-2">
                {post.description}
            </div>

            {/* Author Details */}

            <div className="my-1 flex items-center gap-3">
                <img
                    src={
                        post.author?.gender == "male"
                            ? `https://api.dicebear.com/9.x/personas/svg?seed=${post.author.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=shortCombover&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                            : `https://api.dicebear.com/9.x/personas/svg?seed=${post.author.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=bobBangs,bobCut,extraLong,long&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                    }
                    alt="profile"
                    className="w-[38px] rounded-full pt-[2px]"
                />

                {currentUser?.id != post?.author.id ? (
                    <FollowUnfollowComponent
                        user={post.author}
                        redirect={`blog/${params.slug}`}
                        followStatus={isFollowing}
                        currentUser={currentUser}
                    />
                ) : (
                    <div className="font-semibold text-sm flex items-center gap-4">
                        <div>posted by you 💖</div>

                        <div className="flex items-center md:text-sm text-xs font-medium text-gray-500 gap-3">
                            <Link href={`/update/${post?.id}`}>
                                <button className="flex items-center gap-2 px-2 py-[6px] rounded-md bg-gray-100 hover:bg-gray-200 text-xs">
                                    <AiTwotoneEdit />
                                    <p className="pr-1">Edit</p>
                                </button>
                            </Link>

                            <DeleteButton
                                id={post?.id}
                                imageId={post?.imageId}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* posted ago? */}
            <div className="flex items-center mb-1 mt-2 text-[13px] pl-2 font-medium text-gray-500">
                <div>
                    posted <Timeago date={post?.createdAt} />
                </div>

                {post?.isEdited && (
                    <div className="flex items-center">
                        <div className="mx-[6px]">
                            <GoDotFill color="grey" size={"0.5em"} />
                        </div>
                        <p>Edited</p>
                    </div>
                )}
            </div>

            {/* likes and comments */}
            <div className="my-3 items-center w-[60%] flex gap-6">
                <LikeButton
                    likeStatus={isLiked}
                    NoOfLikes={post._count.likes}
                    slug={post.slug}
                    postId={post.id}
                    currentUser={currentUser}
                />
                <div className="flex items-center gap-2">
                    <TfiCommentAlt size={"0.95em"} />
                    <div className="text-[12px] font-medium">
                        {post._count.comments} Comments
                    </div>
                </div>
            </div>

            {/* image container */}
            <div className="w-full overflow-hidden flex items-center justify-center rounded-md my-2">
                <Image
                    src={post?.image}
                    width={1130}
                    height={600}
                    alt="cover image"
                />
            </div>

            <div
                className="prose-sm prose !max-w-none mt-8"
                dangerouslySetInnerHTML={{
                    __html: post.content,
                }}
            />

            {/* Comment Section Starts Here */}
            <div className="w-full mt-10 mb-2 text-gray-600" id="comments">
                <div className="font-semibold text-3xl">Comments</div>
            </div>

            <div className="w-full h-[70px] py-2">
                {sessionValue ? (
                    <div className="h-[70px]">
                        <Comment
                            postId={post.id}
                            slug={params.slug}
                            currentUserId={currentUser.id}
                        />
                    </div>
                ) : (
                    <div className="flex gap-2 items-center py-3">
                        <MdLogin size={"1.4em"} />
                        <Link href={`/login?redirect=/blog/${params.slug}`}>
                            <div className="font-medium text-sm cursor-pointer">
                                please <u>login</u> to add comments.
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <div className="w-full mb-8">
                {comments?.length == 0 ? (
                    <div className="flex gap-1 items-center mt-2 mb-8">
                        <TbFileSad size={"1.5em"} />
                        <p className="font-semibold text-sm">
                            no comments. be first to comment
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {comments.map((comment, i) => (
                            <div key={i}>
                                <div className="flex gap-[10px] items-center py-3">
                                    <img
                                        src={
                                            comment?.cmntAuthor.gender == "male"
                                                ? `https://api.dicebear.com/9.x/personas/svg?seed=${comment?.cmntAuthor.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=shortCombover&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                                                : `https://api.dicebear.com/9.x/personas/svg?seed=${comment?.cmntAuthor.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=bobBangs,bobCut,extraLong,long&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                                        }
                                        className="w-[38px] rounded-full"
                                    />

                                    <div className="flex flex-col">
                                        <div className="flex gap-[4px] items-center">
                                            <p className="font-bold text-[13px]">
                                                {comment?.cmntAuthor.name}
                                            </p>

                                            <GoDotFill
                                                color="grey"
                                                size={"0.4em"}
                                            />

                                            <p className="text-[11px] font-medium text-[grey]">
                                                <Timeago
                                                    date={comment?.createdAt}
                                                />
                                            </p>
                                        </div>

                                        <div className="text-[12.5px] font-medium">
                                            {comment?.comment}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}