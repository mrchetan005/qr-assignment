
import { IconButton } from "@material-tailwind/react";
import { FaBackward } from "react-icons/fa6";
import { useVideoContext } from "../hooks/useVideoContext";

const Backward = () => {
    const { videoRef } = useVideoContext();

    const handleBackward = () => {
        const video = videoRef.current;
        if (video) {
            const backwardTime = video.currentTime - 5;
            video.currentTime = backwardTime > 0 ? backwardTime : 0;
        }
    };

    return (
        <div className='flex items-end justify-center'>
            <IconButton
                variant="text"
                color="white"
                className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                size="md"
                onClick={handleBackward}
            >
                <FaBackward className="w-6 h-6 mr-1" />
            </IconButton>
        </div>
    )
}

export default Backward;