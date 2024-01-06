// App.js
import { useEffect, useRef, useState } from 'react';
import VideoUploader from './components/VideoUpload';
import useFaceDetection from './hooks/useFaceDetection';
import VideoPlayer from './components/VideoPlayer';
import { IconButton } from '@material-tailwind/react';
import { BsCaretLeft } from "react-icons/bs";

const App = () => {
  const videoRef = useRef();
  const [videoFile, setVideoFile] = useState(null);
  const [playing, setPlaying] = useState(false);

  const handleVideoSelected = (file) => {
    setVideoFile(file);
  };

  useEffect(() => {
    if (playing) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [playing]);

  const onCancel = () => {
    setVideoFile(null);
    setPlaying(false);
    window.location.reload();
  }

  const faceDetectionCanvas = useFaceDetection(videoFile, playing);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen aspect-[9/16] m-auto">
      <VideoPlayer
        playing={playing}
        setPlaying={setPlaying}
        videoRef={videoRef}
        videoFile={videoFile}
        faceDetectionCanvas={faceDetectionCanvas}
      />
      {(!videoFile) && (
        <div className="absolute">
          <VideoUploader onVideoSelected={handleVideoSelected} />
        </div>
      )
      }

      <div className='absolute bottom-2 right-2'>
        <IconButton
          className='rounded-full'
          size="lg"
          onClick={onCancel}
        >
          <BsCaretLeft className="w-7 h-7" />
        </IconButton>
      </div>
    </div>
  );
};

export default App;
