"use server";
import prisma from "../(lib)/prisma";

export async function unFollowUsr(userId, currentUserId) {
    try {
        const res = await prisma.follows.deleteMany({
            where: {
                followedById: currentUserId,
                followingId: userId,
            },
        });
        return { message: "unfollowed", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function followUser(userId, currentUserId) {
    try {
        const res = await prisma.follows.create({
            data: {
                followedById: currentUserId, //current user OR user who want to follow other
                followingId: userId, // id of user, which current user want to follow
            },
        });
        return { message: "following", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}
