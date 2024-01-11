import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useVideoContext } from '../hooks/useVideoContext';
import FaceDetectButton from './FaceDetectButton';
import { fabric } from 'fabric';

const FaceDetectionCanvas = () => {
    const [isFaceDetecting, setIsFaceDetecting] = useState({ detecting: false });

    const [faceDetector, setFaceDetector] = useState([]);
    const { videoRef, canvasRef } = useVideoContext();
    const fabCanvas = useRef(null);
    const animationFrame = useRef(null);

    let index = 0;
    let currentRect = [];
    let intervalIds = [];

    const createAndRenderCanvas = () => {
        fabCanvas.current = null;
        fabCanvas.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: "red",
            width: 500,
            height: 500
        });

        const videoCanvas = new fabric.Image(videoRef.current, {
            left: 200,
            top: 300,
            width: 500,
            height: 500,
            angle: 0,
            originX: 'center',
            originY: 'center',
            objectCaching: true,
        });

        fabCanvas.current.add(videoCanvas);

        const renderCanvas = () => {
            if (!fabCanvas.current) return;
            fabCanvas.current.renderAll();
            animationFrame.current = fabric.util.requestAnimFrame(renderCanvas);
        };

        renderCanvas();
    }

    const drawRect = (coord) => {
        if (currentRect.length > 0 || coord.length === 0) {
            currentRect.forEach(curr => fabCanvas.current.remove(curr));
        }

        coord.forEach((detection) => {
            let rect = new fabric.Rect({
                left: detection.box.x - 50 + fabCanvas.current.getObjects()[0].left - 200,
                top: detection.box.y + 50 + fabCanvas.current.getObjects()[0].top - 300,
                width: detection.box.width + 50 + fabCanvas.current.getObjects()[0].width - 500,
                height: detection.box.height + 50 + fabCanvas.current.getObjects()[0].height - 500,

                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                selectable: false,
                cornerColor: "black",
                cornerStrokeColor: "black",
                borderColor: "black"
                // evented: false
            });

            fabCanvas.current.add(rect);
            fabCanvas.current.bringToFront(rect);
            fabCanvas.current.setActiveObject(rect);
            currentRect.push(rect);
        })
    }

    useEffect(() => {
        if (!isFaceDetecting.detecting || !videoRef.current) return;

        const video = videoRef.current;
        console.log('video', video);

        const detectFace = async () => {
            if (!video) return;
            // video.playbackRate = 4;
            video.play();
            video.muted = true;
            const displaySize = { width: 500, height: 500 };
            const intervalId = setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                console.log(resizedDetections);
                setFaceDetector((item) => [...item, resizedDetections]);
            }, 1000 / 4);

            video.addEventListener("ended", async () => {
                clearInterval(intervalId);
                await video.remove();
                createAndRenderCanvas();
            });

        }

        detectFace();

        const playVideo = () => {
            const intervalId = setInterval(() => {
                if (index < faceDetector.length) {
                    drawRect(faceDetector[index]);
                    index++;
                } else {
                    clearInterval(intervalId);
                    if (currentRect.length > 0) {
                        currentRect.forEach(curr => fabCanvas.current.remove(curr))
                    }
                }
            }, 1000);

            intervalIds.push(intervalId);
        }

        const pauseVideo = () => {
            if (currentRect.length > 0)
                currentRect.forEach((curr) => fabCanvas.current.remove(curr));
            intervalIds.forEach((id) => {
                clearInterval(id);
            });
        }

        video.addEventListener('play', playVideo);
        video.addEventListener('pause', pauseVideo);

        return () => {
            video.removeEventListener('play', playVideo);
            video.removeEventListener('pause', pauseVideo);
        }

    }, [isFaceDetecting.detecting]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                height={0}
                width={0}
            // className="absolute inset-0 z-50 object-contain object-center w-full h-full bg-transparent pointer-events-none"
            />
            <div className="absolute right-0 z-50 pr-5 top-20">
                <FaceDetectButton isFaceDetecting={isFaceDetecting} setIsFaceDetecting={setIsFaceDetecting} />
            </div>
        </>
    );
};

export default FaceDetectionCanvas;


/**
 
// context.clearRect(0, 0, canvas.width, canvas.height);
// faceapi.draw.drawDetections(canvas, resizedDetections);
// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
// faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
// resizedDetections.forEach(result => {
//     const { age, gender, genderProbability } = result;
//     new faceapi.draw.DrawTextField([
//         `${Math.round(age)} years`,
//         `${gender} (${Math.round(genderProbability * 100)}%)`
//     ], result.detection.box.topLeft).draw(canvas);
// });

 */

