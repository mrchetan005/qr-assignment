
import { useNavigate } from 'react-router-dom';
import { useVideoContext } from '../hooks/useVideoContext';
import { Chip } from '@material-tailwind/react';
import VideoUploader from '../components/Utils/VideoUploader';

const Home = () => {
    const { setVideoFile } = useVideoContext();
    const navigate = useNavigate();
    const handleVideoSelected = (file) => {
        if (file) {
            setVideoFile(file)
            navigate('/video');
        }
    }
    return (
        <div className="flex h-screen flex-col items-center justify-center text-center text-white space-y-7">
            <h1 className="text-3xl font-semibold">AI Powered Video Player</h1>
            <p className="text-xs max-w-72">Delve into a captivating viewing experience as our AI-driven video player decodes facial expressions, revealing emotions, age, and gender in real-time.</p>

            <div className="flex items-center gap-2 font-medium pointer-events-none">
                <Chip color="deep-orange" value="Expressions" />
                <Chip color="blue" value="Age" />
                <Chip color="purple" value="Gender" />
            </div>
            <VideoUploader onVideoSelected={handleVideoSelected} />
        </div>
    )
}

export default Home;