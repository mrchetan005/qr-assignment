import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useVideoContext } from '../hooks/useVideoContext';
import FaceDetectButton from './Utils/FaceDetectButton';
import { fabric } from 'fabric';
import Processing from './Utils/Processing';

const FaceDetectionCanvas = () => {
    const [isFaceDetecting, setIsFaceDetecting] = useState({ detecting: false });
    const [isProcessing, setIsProcessing] = useState(false);
    const fabVideo = useRef(null);
    const faceDetector = useRef([]);
    const { videoRef, canvasRef } = useVideoContext();
    const fabCanvas = useRef(null);
    const animationFrame = useRef(null);

    let index = 0;
    let intervalIds = [];

    const createAndRenderCanvas = async () => {
        fabCanvas.current = null;
        const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;

        fabCanvas.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: "red",
            width: aspectRatio > 1 ? 640 : 360,
            height: aspectRatio > 1 ? 360 : 640
        });

        const clipPath = new fabric.Rect({
            left: 142,
            top: 0,
            width: 202,
            height: canvasRef.current.height,
            absolutePositioned: true
        })

        const videoCanvas = new fabric.Image(videoRef.current, {
            left: 0,
            top: 0,
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            scaleX: fabCanvas.current.width / videoRef.current.videoWidth,
            scaleY: fabCanvas.current.height / videoRef.current.videoHeight,
            clipPath,
            // visible: false,
            objectCaching: true,
            // evented: false,  
        });

        fabCanvas.current.add(videoCanvas);
        fabVideo.current = videoCanvas;

        const renderCanvas = () => {
            if (!fabCanvas.current) return;
            fabCanvas.current.renderAll();
            animationFrame.current = fabric.util.requestAnimFrame(renderCanvas);
        };

        renderCanvas();
    }

    const drawFabVideoClipPath = (coord) => {


        coord.forEach(({ box }) => {
            const clipPathRect = new fabric.Rect({
                left: box?.left,
                top: 0,
                right: box?.right,
                width: 202,
                height: canvasRef.current.height,
                absolutePositioned: true
            });

            fabVideo.current.set({ clipPath: clipPathRect });

            fabCanvas.current.add(fabVideo.current);
            fabCanvas.current.bringToFront(fabVideo.current);
            fabCanvas.current.setActiveObject(fabVideo.current);
            console.log('draw');
        });
    }

    useEffect(() => {
        if (videoRef.current) {
            // console.log('videoref', videoRef.current);
            const video = videoRef.current;
            video.addEventListener('loadeddata', () => {
                createAndRenderCanvas();
            })
        }
        if (!isFaceDetecting.detecting || !videoRef.current) {
            return;
        }


        const video = videoRef.current;
        let onPlay;
        let onPause;


        const processVideo = async () => {

            video.width = video.videoWidth;
            video.height = video.videoHeight;

            const detectFace = async () => {
                if (!video) return;
                video.playbackRate = 0.8;
                video.muted = true;
                video.play();

                const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;

                const displaySize = { width: aspectRatio > 1 ? 640 : 360, height: aspectRatio < 1 ? 640 : 360 };
                const intervalId = setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    // console.log('resize', resizedDetections);

                    faceDetector.current = [...faceDetector.current, resizedDetections];
                    drawFabVideoClipPath(resizedDetections)
                }, 1000 / 0.8);

                video.addEventListener("ended", async () => {
                    video.playbackRate = 1;
                    video.muted = false;
                    clearInterval(intervalId);
                    setIsProcessing(false);
                });
            }

            setIsProcessing(true);
            detectFace();

            // console.log(faceDetector.current);

            onPlay = () => {
                const intervalId = setInterval(() => {
                    if (index < faceDetector.current.length) {
                        drawFabVideoClipPath(faceDetector.current[index]);
                        index++;
                    } else {
                        index = 0;
                        clearInterval(intervalId);
                    }
                }, 1000);

                intervalIds.push(intervalId);
            }

            onPause = () => {
                intervalIds.forEach((id) => {
                    clearInterval(id);
                });
            }

            video.addEventListener('play', onPlay);
            video.addEventListener('pause', onPause);

        }

        processVideo();

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
        }

    }, [isFaceDetecting.detecting, videoRef]);

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
            <Processing open={isProcessing} />
        </>
    );
};

export default FaceDetectionCanvas;
