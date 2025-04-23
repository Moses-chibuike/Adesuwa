"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginButton() {
    const location = usePathname();

    return (
        <Link
            href={`/login?redirect=${location}`}
            className="rounded-sm bg-white text-black px-[14px] py-[2px]"
        >
            Login
        </Link>
    );
}
