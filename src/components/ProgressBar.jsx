import { useEffect, useState } from "react";
import { useVideoContext } from "../hooks/useVideoContext";
import { Slider } from "@material-tailwind/react";


const ProgressBar = () => {
    const { videoRef } = useVideoContext();
    const [completed, setCompleted] = useState(0.1);

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
        const newProgress = Math.round(e.target.value);
        setCompleted(newProgress);
        const newTime = (newProgress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
    };

    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/75 to-transparent'>
            <Slider
                onChange={handleProgressBarClick}
                value={completed}
                color="deep-orange"
            />
        </div>
    );
};

export default ProgressBar;