
import { useNavigate } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import { useVideoContext } from '../hooks/useVideoContext';

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
        <div>
            <VideoUploader onVideoSelected={handleVideoSelected} />
        </div>
    )
}

export default Home;