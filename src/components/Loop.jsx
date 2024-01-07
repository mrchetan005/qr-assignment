import { IconButton } from "@material-tailwind/react";
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

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.loop = true;
        setIsLoop(true);
    }, [])

    const toggleLoop = () => {
        const video = videoRef.current;
        if (video) {
            video.loop = !isLoop;
            setIsLoop(!isLoop);
        }
    };

    return (<div className='flex items-end justify-center'>
        <IconButton
            variant="text"
            color="white"
            className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
            size="md"
            onClick={toggleLoop}
        >
            {isLoop
                ? <TbRepeat className="w-7 h-7" />
                : <TbRepeatOff className="w-7 h-7" />
            }
        </IconButton>
    </div>
    )
}

export default Loop;