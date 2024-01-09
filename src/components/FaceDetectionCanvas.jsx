import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useVideoContext } from '../hooks/useVideoContext';
import FaceDetectButton from './FaceDetectButton';

let intervalId;

const FaceDetectionCanvas = () => {
    const [isFaceDetecting, setIsFaceDetecting] = useState({ detecting: false });
    const { videoRef, canvasRef } = useVideoContext();
    const video = videoRef.current;
    const canvas = canvasRef.current;

    useEffect(() => {
        if (!canvas) return;
        const context = canvas.getContext('2d');

        if (!isFaceDetecting.detecting && canvas) {
            return context.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (!video || !isFaceDetecting.detecting) return;

        const renderFrame = async () => {
            try {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withAgeAndGender()
                    .withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                context.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


                resizedDetections.forEach(result => {
                    const { age, gender, genderProbability } = result;
                    new faceapi.draw.DrawTextField([
                        `${Math.round(age)} years`,
                        `${gender} (${Math.round(genderProbability * 100)}%)`
                    ], result.detection.box.topLeft).draw(canvas);
                });
            } catch (error) {
                console.log(error);
                clearInterval(intervalId);
                return;
            }
        };

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        renderFrame();


        // ! if video is playing then set interval 

        const onPlay = () => {
            intervalId = setInterval(async () => {
                if (!isFaceDetecting.detecting) return;
                renderFrame();
            }, 100)
        }

        const onPause = () => {
            clearInterval(intervalId);
        }

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);


        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            clearInterval(intervalId);
        }
    }, [video, canvas, isFaceDetecting.detecting]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                height={video?.videoHeight}
                width={video?.videoWidth}
                className="absolute inset-0 z-50 object-contain object-center w-full h-full bg-transparent pointer-events-none"
            />
            <div className="absolute right-0 z-50 pr-5 top-20">
                <FaceDetectButton isFaceDetecting={isFaceDetecting} setIsFaceDetecting={setIsFaceDetecting} />
            </div>
        </>
    );
};

export default FaceDetectionCanvas;
