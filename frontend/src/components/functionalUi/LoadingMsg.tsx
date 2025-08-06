const LoadingMsg = () => {
    return (
        <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-sm border-2 border-card dark:border-border">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></div>
            </div>
        </div>
    );
};

export {LoadingMsg}