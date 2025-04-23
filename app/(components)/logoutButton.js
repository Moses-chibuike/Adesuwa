"use client";

import toast from "react-hot-toast";
import { deleteSession } from "../(lib)/sessions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    async function handleSubmit() {
        const res = await deleteSession();
        if (!res.success) {
            toast.error(res.message);
            return;
        }
        toast.success("logged out sucessfully");
        window.location.reload();
    }
    return (
        <button
            type="submit"
            onClick={handleSubmit}
            className="px-[10px] py-[1.5px] rounded-sm cursor-pointer bg-white text-black"
        >
            Logout
        </button>
    );
}
