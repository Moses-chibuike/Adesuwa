"use client";

export default function Loading() {
    return (
        <div className="sm:mx-[17%] md:mx-[19%] mx-4 flex flex-col mt-10 gap-1 animate-pulse ">
            <div className="text-[30px] md:text-[39px] font-semibold  text-start  rounded-md bg-gray-300 text-gray-300">
                Lorem ipsum dolor sit, amet consectetur sdfasdf asfas
            </div>

            <div className="font-medium text-[13.5px] leading-7 my-4 bg-gray-300 text-gray-300 rounded-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Doloribus atque, obcaecati corrupti architecto nisi corporis
            </div>

            {/* Author Details */}

            <div className="my-1 flex items-center gap-3">
                <div className="w-[40px] rounded-full pt-[2px] bg-gray-300 h-[40px]" />

                <div className="px-2 py-1 bg-gray-300 text-gray-300 rounded-md">
                    jhasdfhkjsdfjsd
                </div>
            </div>

            {/* posted ago? */}
            <div className="flex items-center mb-1 mt-2 text-[13px] pl-2 font-medium text-gray-300 gap-2">
                <div className="bg-gray-300 rounded-md">
                    posted sometime ago
                </div>
            </div>

            {/* image container */}
            <div className="w-full bg-gray-300 h-[280px] rounded-md sm:h-[400px] my-3"></div>
        </div>
    );
}
