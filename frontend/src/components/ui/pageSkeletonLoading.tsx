import { Skeleton } from "@/components/ui/skeleton";

const HeadInfoSkeleton = () => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-50 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>
    );
};

const SwitchSkeleton = () => {
    return (
        <div className="inline-flex items-center gap-2 py-1 px-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
            <div className="h-5 w-10 rounded-full bg-gray-400 dark:bg-gray-600" />
            <div className="h-5 w-16 rounded bg-gray-400 dark:bg-gray-600" />
        </div>
    );
};

const AddComponentButtonSkeleton = () => {
    return (
        <div className="inline-flex items-center gap-2 py-1 px-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
            <div className="h-5 w-32 rounded bg-gray-400 dark:bg-gray-600" />
        </div>
    );
};
const ToolbarSkeleton = () => {
    return (
        <div className="flex flex-col items-center justify-center px-0  md:px-8 lg:flex lg:flex-row-reverse lg:justify-between top-0 z-1 backdrop-blur-[2px] lg:px-40 py-2 rounded-xl rounded-t-none">
            <div className="flex justify-center items-start mt-2  ">
                <HeadInfoSkeleton />
            </div>

            <div className="flex justify-center items-center space-x-4 mt-4 mb-4 w-fit px-6 py-3 bg-gray-300 dark:bg-gray-700 rounded-xl">
                <SwitchSkeleton />
                <AddComponentButtonSkeleton />
                {/* Add more skeleton placeholders here for SearchBar, UnitToggleSwitch if needed */}
            </div>
        </div>
    );
};
const SkeletonGrid = () => {
    return (
        <>
            <ToolbarSkeleton data-testid="loading" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4 p-0 sm:p-4">
                {Array.from({ length: 16 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-2"
                    >
                        <Skeleton className="w-[20rem] h-[12em] sm:w-[25rem] sm:h-[14em]" />
                    </div>
                ))}
            </div>
        </>
    );
};

export { SkeletonGrid };
