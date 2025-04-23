"use server";
import prisma from "@/app/(lib)/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

export async function commentAction(postId, comment, slug, currentUserId) {
    try {
        await prisma.comment.create({
            data: {
                comment: comment,
                postId: postId,
                cmntAuthorId: currentUserId,
            },
        });
        revalidatePath("/posts/" + slug);
        return { message: "added comment", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function deleteButtonAction(id, imageId) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        await prisma.post.delete({
            where: {
                id: id,
            },
        });
        cloudinary.uploader.destroy(imageId);
        return { success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function unLike(postId, currentUserId) {
    try {
        await prisma.like.deleteMany({
            where: {
                postId: postId,
                likedById: currentUserId,
            },
        });
        return { message: "removed from the liked posts", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function like(postId, currentUserId) {
    try {
        await prisma.like.create({
            data: {
                likedById: currentUserId,
                postId: postId,
            },
        });
        return { message: "added to the liked posts", success: true };
    } catch (err) {
        console.log(err);
        return { message: err.message, success: false };
    }
}
