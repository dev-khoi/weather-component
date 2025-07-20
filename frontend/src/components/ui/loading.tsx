export const LoadingAnimation = () => {
    return (
        <div data-testid="loading" className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
        </div>

    );
};
