// return formatted jxs for the location and time
const HeadInfo = ({
    location,
    time,
}: {
    location: string | undefined;
    time: string;
}) => {
    return (
        <div className="text-[#fcffff] flex flex-col items-center">
            <h2 className=" text-white-300 text-2xl md:text-3xl lg:text-4xl font-bold opacity-90" aria-describedby="the time">{time ?? "loading"}</h2>
            <h2 className=" text-white-300 text-2xl md:text-3xl lg:text-4xl font-bold opacity-90" aria-describedby="the location">{location ?? "loading"}</h2>
        </div>
    );
};

export {HeadInfo}