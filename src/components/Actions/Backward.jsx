
import { IconButton, Tooltip } from "@material-tailwind/react";
import { TbPlayerSkipBackFilled } from "react-icons/tb";
import { useVideoContext } from "../../hooks/useVideoContext";

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
            <Tooltip content="backward (5s)" className="hidden text-black bg-white sm:block">
                <IconButton
                    variant="text"
                    color="white"
                    className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                    size="md"
                    onClick={handleBackward}
                >
                    <TbPlayerSkipBackFilled className="w-6 h-6 mr-1" />
                </IconButton>
            </Tooltip>

        </div>
    )
}

export default Backward;