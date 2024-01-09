import { IconButton, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useVideoContext } from "../hooks/useVideoContext";


const PlayPauseButton = () => {
    const { videoRef } = useVideoContext();
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        const video = videoRef.current;
        setIsPlaying(!isPlaying);
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        if (video.paused) {
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
        }

        const onEnded = () => {
            setIsPlaying(false);
        }

        video.addEventListener('ended', onEnded);

        return () => {
            video.removeEventListener('ended', onEnded);
        }
    }, [videoRef]);

    return (<div className='flex'>
        <Tooltip content={isPlaying ? "Pause" : "Play"} className="hidden text-black bg-white sm:block">
            <IconButton
                color="deep-orange"
                className='mb-2 transition duration-500 scale-125 rounded-full shadow hover:scale-150'
                size="lg"
                onClick={handlePlayPause}
            >
                {isPlaying
                    ? <FaPause className="w-6 h-6" />
                    : <FaPlay className="w-6 h-6 ml-1" />
                }
            </IconButton>
        </Tooltip>
    </div>
    )
}

export default PlayPauseButton;