// useFaceDetection.js
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const useFaceDetection = (videoFile, playing) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
                await faceapi.nets.faceExpressionNet.loadFromUri('/models');
                setIsLoaded(true);
            } catch (error) {
                setIsLoaded(false);
            }
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (isLoaded && videoFile) {
            console.log('playing', playing);
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile);
            video.crossOrigin = 'anonymous';
            video.muted = true;
            playing ? video.play() : video.pause();
            videoRef.current = video;

            const canvas = canvasRef.current;

            const onLoadedData = async () => {
                if (!playing) return;
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                faceapi.matchDimensions(canvas, displaySize);

                const renderFrame = async () => {
                    if (playing && !video.paused && !video.ended) {
                        console.log('draw');
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
            };
            video.addEventListener('loadeddata', onLoadedData);
            return () => {
                console.log("unmounted");
                video.removeEventListener('loadeddata', onLoadedData);
            }
        }
    }, [videoFile, playing, isLoaded]);

    return (
        <canvas className='absolute object-cover inset-0 h-screen bg-transparent aspect-[9/16] pointer-events-none' ref={canvasRef} />
    );
};

export default useFaceDetection;
