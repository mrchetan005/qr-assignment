// useFaceDetection.js
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const useFaceDetection = (videoFile, playing, currentTime, onReady) => {

    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            setIsReady(true);
            onReady(true);
        };

        loadModels();
    }, [onReady]);

    useEffect(() => {
        if (videoFile && playing && isReady) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile);
            video.crossOrigin = 'anonymous';
            video.muted = true;
            video.play();

            const canvas = canvasRef.current;

            video.addEventListener('loadeddata', async () => {
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                faceapi.matchDimensions(canvas, displaySize);

                const renderFrame = async () => {
                    if (!video.paused && !video.ended) {
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();
                        const resizedDetections = faceapi.resizeResults(detections, displaySize);

                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                        faceapi.draw.drawDetections(canvas, resizedDetections);
                        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

                        requestAnimationFrame(renderFrame);
                    }
                };

                renderFrame();

                return () => {
                    video.pause();
                    video.src = '';
                };
            });

            videoRef.current = video;
        }
    }, [videoFile, playing, isReady, currentTime]);

    return <canvas className='absolute inset-0 bg-transparent border pointer-events-none' ref={canvasRef} />;
};

export default useFaceDetection;
