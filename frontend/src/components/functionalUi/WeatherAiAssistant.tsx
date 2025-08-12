import { useState, useRef, type SetStateAction, type Dispatch } from "react";
import { Send, Sparkles } from "lucide-react";
import axios from "axios";
import { LoadingMsg } from "./LoadingMsg";

const backendUrl = import.meta.env.VITE_BACKEND_HOST;

const Bot = () => {
    return (
        <img
            alt="weather component website logo"
            src="/logo.svg"
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full"
        />
    );
};
function AiChatInterface({
    weatherData,
    setChatOn,
}: {
    weatherData: string;
    setChatOn: Dispatch<SetStateAction<boolean>>;
}) {
    const [answer, setAnswer] = useState("Hello, I am Weather Component AI assistant, what can i do to help you today?");
    const [inputText, setInputText] = useState("");
    const [userText, setUserText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        setUserText(inputText);
        setInputText("");

        setAnswer("");
        const currentQuestion = inputText;
        setIsTyping(true);

        try {
            const response = await axios.post(
                `${backendUrl}/weatherAi`,
                {
                    question: currentQuestion,
                    weatherData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                },
            );

            setAnswer(response.data.answer);
            setIsTyping(false);
        } catch (err: any) {
            setUserText("");
            setAnswer(err.message);
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col w-72 sm:w-70 md:w-96 h-[70vh] bg-gray-800 dark:bg-gray-750 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-gray-700 border-2 border-card dark:border-border rounded-t-xl p-2 sm:p-3 md:p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                    {/* Left side: Bot icon + text */}
                    <div className="flex items-start gap-2">
                        <div className="relative">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center py-1">
                                <Bot />
                            </div>
                            <div className="absolute -top-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>

                        {/* Title and subtitle */}
                        <div className="flex flex-col">
                            <h2 className="font-semibold text-white text-xs sm:text-sm md:text-lg flex items-center gap-1 sm:gap-2">
                                Weather Assistant
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300">
                                Online • Ready to help
                            </p>
                        </div>
                    </div>

                    {/* Right side: Close button */}
                    <button className="pr-2" onClick={() => setChatOn(false)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4 bg-gray-800 dark:bg-gray-750">
                {/* User (Right) */}
                {userText ? (
                    <div className="flex justify-end">
                        <div className="bg-gray-300 text-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-2xl max-w-[75%] text-xs sm:text-sm">
                            {userText}
                        </div>
                    </div>
                ) : (
                    ""
                )}

                {answer ? (
                    <div className="flex justify-start items-center gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot />
                        </div>
                        <div className="bg-gray-500 text-black px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-2xl max-w-[75%] text-xs sm:text-sm">
                            {answer}
                        </div>
                    </div>
                ) : (
                    ""
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex items-start gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot />
                        </div>
                        <LoadingMsg />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-gray-700 border-t-2 border-card dark:border-border rounded-b-xl p-2 sm:p-3 md:p-4">
                <div className="flex gap-2 sm:gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Ask me anything about the weather..."
                            maxLength={100}
                            className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-gray-600 border-2 border-card dark:border-border text-white placeholder-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-20 sm:max-h-24 md:max-h-32 text-xs sm:text-sm"
                            rows={1}
                            style={{
                                minHeight: "32px",
                                height: "auto",
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isTyping}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2 text-center">
                    Press Enter to send • Shift + Enter for new line • Max 100
                    characters
                </p>
            </div>
        </div>
    );
}
const AiChat = ({ weatherData }: { weatherData: string }) => {
    const [chatOn, setChatOn] = useState<boolean>(false);

    const toggleChat = () => {
        setChatOn(!chatOn);
    };
    return (
        <div className="fixed bottom-3 right-3 z-50">
            {chatOn ? (
                <AiChatInterface
                    weatherData={weatherData}
                    setChatOn={setChatOn}
                />
            ) : (
                <button
                    onClick={toggleChat}
                    className=" absolute bottom-5 right-5 z-3 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                    <div className="relative">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <Bot />
                        </div>
                        <div className="absolute -top-3 -right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                </button>
            )}
        </div>
    );
};

export { AiChat };
