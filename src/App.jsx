// App.js
import { useEffect, useRef, useState } from 'react';
import VideoUploader from './components/VideoUpload';
import useFaceDetection from './hooks/useFaceDetection';
import { IconButton } from '@material-tailwind/react';
import { FaPause, FaPlay } from "react-icons/fa6";

const App = () => {
  const videoRef = useRef();
  const [videoFile, setVideoFile] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [videoState, setVideoState] = useState({
    currentTime: 0,
  });

  const handleVideoSelected = (file) => {
    setVideoFile(file);
    setPlaying(true);
    setVideoState({ currentTime: 0 });
  };


  useEffect(() => {

  }, [isReady]);

  const handlePlayPause = () => {
    if (!isReady) {
      return;
    }
    setPlaying(!playing);
  };

  const onReady = (isLoadedModels) => {
    setIsReady(isLoadedModels);
  }

  const faceDetectionCanvas = useFaceDetection(videoFile, playing, videoState.currentTime, onReady);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {(videoFile && isReady) ?
        <div className='relative w-full h-full'>
          <video
            ref={videoRef}
            className='relative w-full h-full'
            src={URL.createObjectURL(videoFile)}
            crossOrigin='anonymous'></video>

          {faceDetectionCanvas}

          <div className='absolute bottom-0 left-0 right-0 flex items-center justify-center'>
            <IconButton
              className=''
              onClick={handlePlayPause}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </IconButton>
          </div>
        </div>
        : <VideoUploader onVideoSelected={handleVideoSelected} />
      }
    </div>
  );
};

export default App;
