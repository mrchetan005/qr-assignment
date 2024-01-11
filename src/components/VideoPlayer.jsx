import Actions from "./Actions";
import FaceDetectionCanvas from "./FaceDetectionCanvas";
import { useVideoContext } from "../hooks/useVideoContext";


const VideoPlayer = () => {
    const { videoFile, videoRef } = useVideoContext();

    return (
        <div className='relative w-full h-full group'>
            <FaceDetectionCanvas />
            <video
                ref={videoRef}
                // className='relative object-contain object-center w-full h-full '
                className="absolute hidden object-left-top"
                height={500}
                width={500}
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'>
            </video>
            <Actions />
        </div>
    )
}

export default VideoPlayer;