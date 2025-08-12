import { provokeGeolocation } from "@/helpers/helper";
import { Button } from "@headlessui/react";

export const GetLocationButton = () => {
    return (
        <>
            <div className="block z-0 absolute top-16 right-0 w-[700px] h-[1000px] overflow-hidden pointer-events-none">
                <div className="relative animate-borderGlow w-[20rem] h-[20rem] translate-x-[30rem] -translate-y-[50px] rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 animate-glow"></div>
                <div className="-translate-y-[40px]">
                    <div className="cloud animate-floatCloud translate-x-[500px] -translate-y-[130px]"></div>
                    <div className="cloud animate-floatCloud translate-x-[350px] -translate-y-[300px]"></div>

                    <div className="cloud animate-floatCloud translate-x-[440px] -translate-y-[450px]"></div>
                </div>
            </div>
            <div className="relative h-30 w-full flex flex-row justify-center top-15">
                <span className="relative -top-1 -right-2 flex size-3">
                    <span className="absolute inline-flex size-4 animate-bounce  rounded-full bg-sky-400 opacity-75 items-center">
                        <svg
                            className="w-6 h-6 mx-auto text-gray-800 "
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                            />
                        </svg>
                    </span>
                </span>
                <Button
                    onClick={provokeGeolocation}
                    className=" h-12 bg-amber-200 border-b-2 flex items-middle text-gray-700 text-3xl font-bold px-4 py-2 rounded-lg hover:bg-amber-100 transition duration-100"
                >
                    click to show weather
                </Button>
            </div>
        </>
    );
};
