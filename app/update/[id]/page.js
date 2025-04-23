import { notFound, redirect } from "next/navigation";
import { getPostDetails } from "./action";
import UpdateForm from "./form";
import { decrypt } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";

export default async function UpdatePost({ params }) {
    const user = await decrypt(cookies().get("session")?.value);
    if (!user.success) {
        redirect(`/login?redirect=/update/${params.id}`);
    }

    const post = await getPostDetails(params.id);
    if (!post.success) {
        return notFound();
    }

    if (post.authorId != user.id) {
        redirect(`/blog/${post.slug}`);
    }
    return <UpdateForm postData={post} />;
}
