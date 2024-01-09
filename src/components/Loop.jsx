import { IconButton, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { TbRepeatOff, TbRepeat } from "react-icons/tb";
import { useVideoContext } from "../hooks/useVideoContext";


const Loop = () => {
    const { videoRef } = useVideoContext();
    const [isLoop, setIsLoop] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.loop = isLoop;
    }, [isLoop, videoRef]);

    const toggleLoop = () => {
        const video = videoRef.current;
        if (video) {
            video.loop = !isLoop;
            setIsLoop(!isLoop);
        }
    };

    return (<div className='flex items-end justify-center'>
        <Tooltip placement="right" content={isLoop ? "Loop Off" : "Loop On"} className="hidden text-black bg-white sm:block">
            <IconButton
                variant="text"
                color="white"
                className='ml-4 transition duration-500 rounded-full shadow hover:scale-125'
                size="md"
                onClick={toggleLoop}
            >
                {isLoop
                    ? <TbRepeat className="w-6 h-6" />
                    : <TbRepeatOff className="w-6 h-6" />
                }
            </IconButton>
        </Tooltip>
    </div>
    )
}

export default Loop;