"use client";

import toast from "react-hot-toast";
import { deleteButtonAction } from "./action";
import { useRouter } from "next/navigation";
import { AiTwotoneDelete } from "react-icons/ai";
import Swal from "sweetalert2";

export default function DeleteButton({ id, imageId }) {
    const router = useRouter();

    async function deletePost() {
        Swal.fire({
            title: "Delete this post?",
            text: "you wont be able to retrieve this",
            icon: "question",
            width: 500,
            showCancelButton: true,
            confirmButtonColor: "#f54c2f",
            cancelButtonColor: "#333333",
            confirmButtonText: "delete",
        }).then(async (res) => {
            if (res.isConfirmed) {
                const isDeleted = await deleteButtonAction(id, imageId);
                if (!isDeleted.success) {
                    toast.error(isDeleted.message);
                    return;
                }
                router.push("/");
                toast.success("post deleted");
            }
        });
        return;
    }
    return (
        <div>
            <button
                onClick={() => deletePost()}
                className="flex items-center gap-2 px-2 py-[6px] rounded-md bg-gray-100 hover:bg-gray-200 text-xs"
            >
                <AiTwotoneDelete />
                <p className="pr-1">Delete</p>
            </button>
        </div>
    );
}
