
import { IconButton } from "@material-tailwind/react";
import { FaForward } from "react-icons/fa6";
import { useVideoContext } from "../hooks/useVideoContext";

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
            <IconButton
                variant="text"
                color="white"
                className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                size="md"
                onClick={handleForward}
            >
                <FaForward className="w-6 h-6 ml-1" />
            </IconButton>
        </div>
    )
}

export default Forward;