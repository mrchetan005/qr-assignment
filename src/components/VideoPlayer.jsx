import { IconButton } from "@material-tailwind/react";
import { FaPause, FaPlay } from "react-icons/fa6";


const VideoPlayer = ({ playing, setPlaying, videoRef, videoFile, faceDetectionCanvas }) => {
    const handlePlayPause = () => {
        setPlaying(!playing);
    };
    return (
        <div className='relative w-full h-full group'>
            <video
                ref={videoRef}
                className='relative w-full h-full object-cover aspect-[9/16] object-center'
                src={videoFile && URL.createObjectURL(videoFile)}
                crossOrigin='anonymous'></video>

            {faceDetectionCanvas}

            {videoFile && (<div className='absolute inset-0 items-center justify-center hidden group-hover:flex'>
                <IconButton
                    className='pl-2 rounded-full'
                    size="lg"
                    onClick={handlePlayPause}
                >
                    {playing ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6 ml-1" />}
                </IconButton>
            </div>)}
        </div>
    )
}

export default VideoPlayer;