"use server";

import prisma from "../../(lib)/prisma";
import { v2 as cloudinary } from "cloudinary";

//function to send the details of post using id
export async function getPostDetails(id) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
        });
        if (!post) {
            throw new Error("no posts found");
        }
        return { ...post, success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

//function to upload image and return url
export async function replaceImage(FormData) {
    try {
        const file = FormData.get("image");
        const publicId = FormData.get("publicId");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const post = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        public_id: publicId,
                        overwrite: true,
                        invalidate: true,
                        quality: "auto",
                    },
                    function (err, result) {
                        if (err) {
                            throw new Error("unable to upload image");
                        }
                        resolve(result);
                    }
                )
                .end(buffer);
        });
        return { ...post, success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function createSlug(input) {
    let slug = input.toLowerCase();
    slug = slug.replace(/[^\w\s-]/g, "");
    slug = slug.replace(/\s+/g, "-");
    slug = slug.replace(/-+/g, "-");
    slug = slug.replace(/^-+|-+$/g, "");
    return slug;
}

export async function updatePostAction(data) {
    try {
        const post = await prisma.post.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                content: data.content,
                description: data.description,
                category: data.category,
                image: data.image,
                imageId: data.imageId,
                slug: data.slug,
                isEdited: true,
            },
        });
        return { ...post, success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function validateTitle(title, id) {
    const res = await prisma.post.findMany({
        where: {
            title: title,
        },
    });
    if (res.length == 0) {
        return true;
    }
    if (res[0].id == id) {
        return true;
    }
    return false;
}
