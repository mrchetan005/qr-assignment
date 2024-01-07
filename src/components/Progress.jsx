import { useEffect, useState } from "react";
import { useVideoContext } from "../hooks/useVideoContext";


const Progress = () => {
    const { videoRef } = useVideoContext();
    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        const updateProgress = () => {
            setCompleted(Math.floor((video.currentTime / video.duration) * 100));
        };

        video.addEventListener("timeupdate", updateProgress);

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
        };
    }, [videoRef]);

    const handleProgressBarClick = (e) => {
        const boundingRect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - boundingRect.left;
        const progressBarWidth = boundingRect.width;
        const newProgress = (offsetX / progressBarWidth) * 100;

        setCompleted(newProgress);
        const newTime = (newProgress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
    };

    return (
        <div className='absolute top-0 left-0 right-0 pt-3 pb-2 pr-2 bg-gradient-to-b from-black/75 to-transparent'>
            <div
                className="absolute top-0 left-0 right-0 z-10 h-2 bg-black/20"
                onClick={handleProgressBarClick}
                style={{ cursor: 'pointer' }}
            >
                <div
                    style={{ width: `${completed}%` }}
                    className="h-2 transition-all duration-200 bg-white/50 group-hover:bg-white"
                ></div>
            </div>
        </div>
    );
};

export default Progress;