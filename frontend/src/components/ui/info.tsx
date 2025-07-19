// return formatted jxs for the location and time
const HeadInfo = ({
    location,
    time,
}: {
    location: string | undefined;
    time: string;
}) => {
    return (
        <div className="text-[#fcffff] flex flex-col items-center text-white-300 text-xl md:text-2xl lg:text-3xl font-bold opacity-90">
            <h2 className="text-4xl" aria-describedby="the time">{time ?? "loading"}</h2>
            <h2 className="text-4xl" aria-describedby="the location">{location ?? "loading"}</h2>
        </div>
    );
};

export {HeadInfo}