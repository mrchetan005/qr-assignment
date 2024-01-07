import { useVideoContext } from "../hooks/useVideoContext";
import Backward from "./Backward";
// import FaceDetectButton from "./FaceDetectButton";
import Forward from "./Forward";
import Loop from "./Loop";
import PlayPauseButton from "./PlayPauseButton";
import ResetButton from "./ResetButton";
import Volume from "./Volume";

const Actions = () => {
    const { videoFile } = useVideoContext();
    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-4 bg-gradient-to-b from-transparent to-black">
                {videoFile && (
                    <div className="flex items-center justify-center gap-3 sm:gap-5">
                        <Loop />
                        <Backward />
                        <PlayPauseButton />
                        <Forward />
                        <Volume />
                    </div>
                )}
            </div>
            <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-start gap-5 pt-5 pr-1 bg-gradient-to-r from-transparent to-black/20">
                <ResetButton />
            </div>
        </>
    )
}

export default Actions;

