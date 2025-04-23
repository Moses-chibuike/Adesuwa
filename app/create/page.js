import { cookies } from "next/headers";
import CreateForm from "./form";
import { redirect } from "next/navigation";
import { decrypt } from "../(lib)/sessions";

export default async function CreatePost() {
    const currentUser = await decrypt(cookies().get("session")?.value);
    if (!currentUser.success) {
        redirect("/login?redirect=/create");
    }
    return <CreateForm currentUser={currentUser} />;
}
