import { Disclosure } from "@headlessui/react";
import { SearchBar } from "../lib/searchBar.tsx";

// import all the needed things
const FunctionBar = ({
    location,
    time,
}: {
    location: string | undefined;
    time: string;
}) => {
    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        {/* the logo */}
                        <a href="/">
                            <img
                                alt="weather component website logo"
                                src="/logo.svg"
                                className="size-8 rounded-full"
                            />
                        </a>

                        {/* the head info location / time */}
                        <div className="text-[#fcffff] flex flex-col items-center text-white-300 sm:text-lg md:text-xl font-bold opacity-90">
                            <div aria-describedby="the location">
                                {location ?? "loading"}
                            </div>
                            <div aria-describedby="the time">
                                {time ?? "loading"}
                            </div>
                        </div>

                        {/* search bar to add component */}
                        <SearchBar />
                    </div>
                </div>
            </Disclosure>
        </>
    );
};

export { FunctionBar };
