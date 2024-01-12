import Actions from "./Actions";
import FaceDetectionCanvas from "./FaceDetectionCanvas";
import { useVideoContext } from "../hooks/useVideoContext";


const VideoPlayer = () => {
    const { videoFile, videoRef } = useVideoContext();

    return (
        <div className='relative flex items-center justify-center w-full h-full group '>
            <FaceDetectionCanvas />
            <video
                ref={videoRef}
                className="hidden"
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'>
            </video>
            <Actions />
        </div>
    )
}

export default VideoPlayer;