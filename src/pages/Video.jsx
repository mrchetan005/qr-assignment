import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { useVideoContext } from '../hooks/useVideoContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import TimelineEditor from '../components/timeline/TimelineEditor';

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
        <div className='flex'>
            <Sidebar />
            <div className='relative flex flex-col h-screen w-full'>
                <VideoPlayer
                    videoRef={videoRef}
                    videoFile={videoFile}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
                <TimelineEditor />
            </div>
        </div>
    );
};

export default Video;
