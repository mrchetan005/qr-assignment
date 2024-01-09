import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { useVideoContext } from '../hooks/useVideoContext';
import { useNavigate } from 'react-router-dom';

const Video = () => {
    const { videoFile, videoRef } = useVideoContext();
    const [isPlaying, setIsPlaying] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            navigate('/');
        }
    }, [videoFile, navigate]);

    return (
        <>
            <VideoPlayer
                videoRef={videoRef}
                videoFile={videoFile}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />
        </>
    );
};

export default Video;
