"use client";

import { useState } from "react";
import { followUser, unFollowUsr } from "./(components)/followAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RiUserUnfollowLine, RiUserFollowLine } from "react-icons/ri";
import Link from "next/link";

export default function UserCard({ user, currentUserId }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(
        user?._count.followers
    );
    const router = useRouter();

    async function followButtonAction() {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        isFollowing
            ? setFollowersCount(parseInt(followersCount) - 1)
            : setFollowersCount(parseInt(followersCount) + 1);

        const res = isFollowing
            ? await unFollowUsr(user.id, currentUserId)
            : await followUser(user.id, currentUserId);

        if (!res.success) {
            if ((res.message = "not authorised")) {
                toast.error("please login");
                router.push("/login");
                return;
            }
            toast.error(res.message);
            isFollowing ? setIsFollowing(true) : setIsFollowing(false);
        }
    }

    return (
        <div className=" flex items-center hover:bg-[#f5f5f5] p-2 rounded-lg transition-all ease-in-out duration-500 cursor-pointer gap-3">
            <img
                src={
                    user.gender == "male"
                        ? `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=shortCombover&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                        : `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&eyes=happy,open,wink&facialHairProbability=0&hair=bobBangs,bobCut,extraLong,long&hairColor=362c47&mouth=bigSmile,smile,smirk&nose=smallRound&skinColor=d78774&body=squared`
                }
                className="w-[38px] rounded-full"
            />

            <div className="flex flex-col w-[45%] sm:w-[29%]">
                <Link href={`/user/${user.id}`}>
                    <div className="text-[14px] font-semibold hover:underline mb-[2px]">
                        {user.name}
                    </div>
                </Link>

                <div className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                    {followersCount} followers
                </div>
            </div>

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
    );
}
