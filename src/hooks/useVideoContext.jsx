import { createContext, useContext, useRef, useState } from "react";

const videoContext = createContext();

const VideoContextProvider = ({ children }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [isFaceDetecting, setIsFaceDetecting] = useState(false);

    const videoRef = useRef(null);

    return (
        <videoContext.Provider value={{ videoFile, setVideoFile, videoRef, isFaceDetecting, setIsFaceDetecting }}>
            {children}
        </videoContext.Provider>
    )
}

export default VideoContextProvider;

export const useVideoContext = () => useContext(videoContext);