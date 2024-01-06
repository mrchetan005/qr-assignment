// useFaceDetection.js
import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const useFaceDetection = (videoFile, playing) => {

    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (videoFile) {
            console.log('playing', playing);
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile);
            video.crossOrigin = 'anonymous';
            video.muted = true;
            playing ? video.play() : video.pause();

            const canvas = canvasRef.current;

            const onLoadedData = async () => {
                const displaySize = { width: video.width || 900, height: video.height || 1600 };
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
            };
            video.addEventListener('loadeddata', onLoadedData);

            videoRef.current = video;

            return () => {
                video.removeEventListener('loadeddata', onLoadedData);
            }
        }
    }, [videoFile, playing]);

    return (
        <canvas className='absolute inset-0 h-screen bg-transparent aspect-[9/16] pointer-events-none' ref={canvasRef} />
    );
};

export default useFaceDetection;
