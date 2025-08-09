import { NavBar } from "../components/ui/navbar";
import { Footer } from "../components/ui/footer";
export const LandingPage = () => {
    return (
        <>
            <NavBar />

            <main className="h-fit">
                <section className="pl-4" id="weather">
                    <div className="relative w-100vw flex justify-center">
                        <div className="lg:flex-col items-center">
                            <div>
                                <h1 className="">
                                    Weather Component
                                </h1>
                                <p className="text-describe text-xl xs:text-sm font-medium">
                                    Say goodbye to generic forecasts — design
                                    your own weather view.
                                </p>
                            </div>
                            <div className="mt-4 relative block">
                                <span className="relative top-1 right-1 flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                </span>
                                <a
                                    href="/weather"
                                    className="inline-block  bg-amber-200 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-amber-100 transition duration-100"
                                >
                                    View Weather
                                </a>
                            </div>
                        </div>

                        {/* the sun and cloud */}
                        {/* < className="flex "> */}

                        <div className="hidden lg:block z-0 absolute -top-0 right-0 w-[700px] h-[1000px] overflow-hidden pointer-events-none">
                            <div className="relative animate-borderGlow w-[20rem] h-[20rem] translate-x-[30rem] -translate-y-[50px] rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 animate-glow"></div>
                            <div className="-translate-y-[40px]">
                                <div className="cloud animate-floatCloud translate-x-[500px] -translate-y-[130px]"></div>
                                <div className="cloud animate-floatCloud translate-x-[350px] -translate-y-[300px]"></div>

                                <div className="cloud animate-floatCloud translate-x-[440px] -translate-y-[450px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* demovideo */}
                    <section className="mt-16 px-4 pb-4 w-full" id="demo">
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="text-4xl font-bold mb-4">
                                Demo
                            </h2>
                            <p className="text-describe text-xl  xs:text-sm font-medium mb-8">
                                Experience the features — watch a quick
                                walkthrough of your custom weather view.
                            </p>

                            <div className="rounded-xl overflow-hidden shadow-2xl border border-amber-200 bg-white">
                                <video
                                    className="w-full h-auto"
                                    controls
                                    preload="metadata"
                                    poster="./../../thumbnail.png"
                                >
                                    <source
                                        src="/demoVid.mp4"
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
};
