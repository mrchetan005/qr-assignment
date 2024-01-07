import Actions from "./Actions";
import Progress from "./Progress";
import FaceDetectionCanvas from "./FaceDetectionCanvas";
import { useVideoContext } from "../hooks/useVideoContext";


const VideoPlayer = () => {
    const { videoFile, videoRef } = useVideoContext();

    return (
        <div className='relative w-full h-full group'>
            <video
                ref={videoRef}
                className='relative w-full h-full object-cover aspect-[9/16] object-top'
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'>
            </video>

            <FaceDetectionCanvas />
            <Progress />
            <Actions />
        </div>
    )
}

export default VideoPlayer;