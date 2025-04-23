"use client";
import { ScaleLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="h-[85svh] w-full flex items-center justify-center">
            <ScaleLoader height={25} margin={3} speedMultiplier={1} />
        </div>
    );
}
