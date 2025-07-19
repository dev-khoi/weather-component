import { NavBar } from "@/components/ui/navbar";

const ErrorPage = () => {
    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center relative overflow-hidden">
                {/* Floating Bubbles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none my-5 h-[100dvh]">
                    <div
                        className="absolute top-1/4 left-1/10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce"
                        style={{
                            animationDelay: "0s",
                            animationDuration: "6s",
                        }}
                    ></div>
                    <div
                        className="absolute top-3/5 right-1/10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce"
                        style={{
                            animationDelay: "2s",
                            animationDuration: "6s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 left-1/5 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"
                        style={{
                            animationDelay: "4s",
                            animationDuration: "6s",
                        }}
                    ></div>
                </div>

                {/* Error Container */}
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center max-w-lg w-11/12 mx-4 border border-white border-opacity-20">
                    {/* Logo */}
                    <img
                        src="/largeLogo.svg"
                        alt="Company Logo"
                        className="max-w-48 h-auto mx-auto mb-8 filter drop-shadow-lg"
                    />

                    {/* Error Code */}
                    <div className="text-8xl font-extrabold text-blue-500 mb-6 drop-shadow-sm">
                        404
                    </div>

                    {/* Error Title */}
                    <h1 className="text-3xl font-semibold text-blue-900 mb-4">
                        Oops! Page Not Found
                    </h1>

                    {/* Error Message */}
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                        The page you're looking for seems to have wandered off.
                        Don't worry, it happens to the best of us!
                    </p>

                    {/* Back Button */}
                    <a
                        href="/"
                        className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 px-8 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-blue-500/30"
                    >
                        Take Me Home
                    </a>
                </div>
            </div>
        </>
    );
};

export { ErrorPage };
