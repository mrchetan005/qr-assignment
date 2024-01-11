import { createContext, useContext, useRef, useState } from "react";

const videoContext = createContext();

const VideoContextProvider = ({ children }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [isFaceDetecting, setIsFaceDetecting] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    return (
        <videoContext.Provider value={{ videoFile, setVideoFile, videoRef, canvasRef, isFaceDetecting, setIsFaceDetecting, isModelsLoaded, setIsModelsLoaded }}>
            {children}
        </videoContext.Provider>
    )
}

export default VideoContextProvider;

export const useVideoContext = () => useContext(videoContext);