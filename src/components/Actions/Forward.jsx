
import { IconButton, Tooltip } from "@material-tailwind/react";
import { TbPlayerSkipForwardFilled } from "react-icons/tb";


import { useVideoContext } from "../../hooks/useVideoContext";

const Forward = () => {
    const { videoRef } = useVideoContext();

    const handleForward = () => {
        const video = videoRef.current;
        if (video) {
            const forwardTime = video.currentTime + 5;
            video.currentTime = forwardTime < video.duration ? forwardTime : video.duration;
        }
    };

    return (
        <div className='flex items-end justify-center'>
            <Tooltip content="forward (5s)" className="hidden text-black bg-white sm:block">
                <IconButton
                    variant="text"
                    color="white"
                    className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                    size="md"
                    onClick={handleForward}
                >
                    <TbPlayerSkipForwardFilled className="w-6 h-6 ml-1" />
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default Forward;