import Actions from "./Actions";
import FaceDetectionCanvas from "./FaceDetectionCanvas";
import { useVideoContext } from "../hooks/useVideoContext";


const VideoPlayer = () => {
    const { videoFile, videoRef } = useVideoContext();

    return (
        <div className='relative w-full h-full group flex-[4]'>
            <FaceDetectionCanvas />
            <video
                ref={videoRef}
                className="hidden"
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'
            />
            <Actions />
        </div>
    )
}

export default VideoPlayer;