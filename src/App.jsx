// App.js
import { useEffect, useRef, useState } from 'react';
import VideoUploader from './components/VideoUpload';
import useFaceDetection from './hooks/useFaceDetection';
import VideoPlayer from './components/VideoPlayer';

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
    </div>
  );
};

export default App;
