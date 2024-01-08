import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useVideoContext } from '../hooks/useVideoContext';
import FaceDetectButton from './FaceDetectButton';

let intervalId;

const FaceDetectionCanvas = () => {
    const [isFaceDetecting, setIsFaceDetecting] = useState(false);
    const { videoRef } = useVideoContext();
    const canvasRef = useRef(null);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    useEffect(() => {
        if (!video || !isFaceDetecting) return;
        const renderFrame = async () => {
            if (!isFaceDetecting) return;
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);
            intervalId = setInterval(async () => {
                try {
                    const detections = await faceapi
                        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceExpressions();
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    console.log('drawing', video.width, video.videoWidth, video.offsetWidth);

                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                } catch (error) {
                    console.log(error);
                    clearInterval(intervalId);
                    return;
                }
            }, 100)
        };

        const stopRender = () => {
            clearInterval(intervalId);
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        console.log(displaySize);

        video.addEventListener('play', renderFrame);
        video.addEventListener('pause', stopRender);
        return () => {
            clearInterval(intervalId);
            video.removeEventListener('play', renderFrame);
            video.removeEventListener('pause', stopRender);
        }
    }, [video, canvas, isFaceDetecting]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                className="absolute object-cover object-top inset-0 h-full w-full bg-transparent aspect-[9/16] md:aspect-auto pointer-events-none z-50"
            />
            <div className="absolute right-0 z-50 pr-5 top-28">
                <FaceDetectButton isFaceDetecting={isFaceDetecting} setIsFaceDetecting={setIsFaceDetecting} />
            </div>
        </>
    );
};

export default FaceDetectionCanvas;
