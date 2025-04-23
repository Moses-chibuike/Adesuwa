"use client";
import { followUser, unFollowUsr } from "@/app/(components)/followAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiUserUnfollowLine, RiUserFollowLine } from "react-icons/ri";

export default function FollowUnfollowComponent({
    user,
    redirect,
    followStatus,
    currentUser,
}) {
    const [isFollowing, setIsFollowing] = useState(followStatus);
    const [followersCount, setFollowersCount] = useState(
        user?._count.followers
    );
    const router = useRouter();

    async function followButtonAction() {
        if (!currentUser.success) {
            router.push(`/login?redirect=${redirect}`);
            return;
        }

        isFollowing ? setIsFollowing(false) : setIsFollowing(true);

        isFollowing
            ? setFollowersCount(parseInt(followersCount) - 1)
            : setFollowersCount(parseInt(followersCount) + 1);

        const res = isFollowing
            ? await unFollowUsr(user.id, currentUser.id)
            : await followUser(user.id, currentUser.id);

        if (!res.success) {
            isFollowing ? setIsFollowing(true) : setIsFollowing(false);
            toast.error(res.message);
        }
    }

    return (
        <div className="flex items-center gap-6">
            <div className="">
                <div className="font-semibold text-[15px] hover:underline">
                    <Link href={`/user/${user.id}`}>{user.name}</Link>
                </div>
                <div className="text-xs font-medium mb-1">
                    {followersCount} people follow
                </div>
            </div>
            <div>
                <button
                    className="text-white bg-[#333333] px-2 py-[5px] font-medium rounded-md text-[11px] flex"
                    onClick={followButtonAction}
                >
                    {isFollowing ? (
                        <div className="flex items-center gap-2">
                            <RiUserUnfollowLine size={"1.2em"} />
                            <div className="pr-2">Unfollow</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <RiUserFollowLine size={"1.2em"} />
                            <div className="pr-2">Follow</div>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
