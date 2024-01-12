import { IconButton, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { useVideoContext } from "../../hooks/useVideoContext";


const Volume = () => {
    const { videoRef } = useVideoContext();
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.volume = isMuted ? 0 : 1;
    }, [isMuted, videoRef]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.volume = 1;
        setIsMuted(false);
    }, [])

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.volume = isMuted ? 1 : 0;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className='flex items-end justify-center'>
            <Tooltip content={isMuted ? "Unmute" : "Mute"} className="hidden text-black bg-white sm:block">
                <IconButton
                    variant="text"
                    color="white"
                    className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                    size="md"
                    onClick={toggleMute}
                >
                    {isMuted
                        ? <MdVolumeOff className="w-7 h-7" />
                        : <MdVolumeUp className="w-7 h-7" />
                    }
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default Volume;