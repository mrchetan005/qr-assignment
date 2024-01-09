import Actions from "./Actions";
import FaceDetectionCanvas from "./FaceDetectionCanvas";
import { useVideoContext } from "../hooks/useVideoContext";


const VideoPlayer = () => {
    const { videoFile, videoRef } = useVideoContext();

    return (
        <div className='relative w-full h-full group'>
            <video
                ref={videoRef}
                className='relative object-contain object-center w-full h-full sm:object-center md:aspect-auto'
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'>
            </video>

            <FaceDetectionCanvas />
            <Actions />
        </div>
    )
}

export default VideoPlayer;