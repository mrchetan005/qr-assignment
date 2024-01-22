import { useEffect, useState } from "react";
import { useVideoContext } from "../../hooks/useVideoContext";
import Backward from "./Backward";
import Forward from "./Forward";
import Loop from "./Loop";
import PlayPauseButton from "./PlayPauseButton";
import ResetButton from "./ResetButton";
import Volume from "./Volume";
import FullScreen from "./FullScreen";
import ProgressBar from "./ProgressBar";

let timeoutId;

const Actions = () => {
    const { videoFile, videoRef } = useVideoContext();
    const [showActions, setShowActions] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onMouseMove = () => {
            setShowActions(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setShowActions(false);
            }, 3000);
        }
        document.body.addEventListener('mousemove', onMouseMove);
        return () => {
            clearTimeout(timeoutId);
            document.body.removeEventListener('mousemove', onMouseMove);
        }
    }, []);

    return (
        <div className={`${showActions ? "flex" : "hidden"}`}>
            <ProgressBar />
            {/* <div className={`fixed bottom-0 left-0 right-0 items-end justify-center pb-4 bg-gradient-to-b from-transparent transition-all duration-500 to-black`}>
                {videoFile && (
                    <div className="flex items-center justify-center gap-3 sm:gap-5">
                        <Volume />
                        <Backward />
                        <PlayPauseButton />
                        <Forward />
                        <FullScreen />
                    </div>
                )}
            </div> */}
            <div className={`fixed top-0 right-0 flex items-center justify-between gap-5 pt-5 pr-1 w-full`}>
                {/* <Loop /> */}
                <ResetButton />
            </div>
        </div>
    )
}

export default Actions;

