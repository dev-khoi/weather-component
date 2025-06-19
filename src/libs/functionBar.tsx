import { Disclosure } from "@headlessui/react";
import { SearchBar } from "./searchBar.tsx";

// import all the needed things
const FunctionBar = ({ city }: { city: string | undefined }) => {
    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <SearchBar />
            
                            <div className="text-white-300 text-xl font-bold opacity-90 ">
                                {city ?? ""}
                            </div>

                        <div className="text-white-300 text-xl font-bold ">weatherComponent</div>
                    </div>
                </div>
            </Disclosure>
        </>
    );
};

export { FunctionBar };
