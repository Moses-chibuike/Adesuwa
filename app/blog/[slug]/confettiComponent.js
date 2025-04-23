"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function ConfettiComponent() {
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);
    const searchParams = useSearchParams();
    const isConfetti = searchParams.get("c") || null;
    return (
        <div>
            {isConfetti == "true" && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={700}
                    gravity={0.0992}
                />
            )}
        </div>
    );
}
