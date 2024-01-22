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
    let intervalIds = useRef([]);

    let index = 0;
    let verticalVideoCanvasWidth = 9 / 16 * fabCanvas.current?.height;

    const createAndRenderCanvas = async () => {
        fabCanvas.current = null;
        const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;

        fabCanvas.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: "transparent",
            width: aspectRatio > 1 ? 854 : 480,
            height: aspectRatio > 1 ? 480 : 854
        });

        verticalVideoCanvasWidth = 9 / 16 * fabCanvas.current?.height;

        const clipPath = new fabric.Rect({
            left: 0,
            top: 0,
            width: verticalVideoCanvasWidth,
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

        console.log('drawing', coord);
        coord.forEach(({ left, width }) => {
            fabVideo.current.set({
                left: -left + (width > (verticalVideoCanvasWidth / 2) ? -width / 8 : width / 2),
            });

            fabCanvas.current.add(fabVideo.current);
            fabCanvas.current.bringToFront(fabVideo.current);
            fabCanvas.current.setActiveObject(fabVideo.current);
            // console.log('draw');
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
        let onSeek;


        const processVideo = async () => {

            video.width = video.videoWidth;
            video.height = video.videoHeight;

            const detectFace = async () => {
                if (!video) return;
                video.playbackRate = 4;
                video.muted = true;
                video.play();

                const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;

                const displaySize = { width: aspectRatio > 1 ? 854 : 480, height: aspectRatio < 1 ? 854 : 480 };
                const intervalId = setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    // console.log('resize', resizedDetections);

                    const customizedDetections = customiseDetections(resizedDetections, video.currentTime);

                    faceDetector.current = [...faceDetector.current, customizedDetections];
                    // drawFabVideoClipPath(resizedDetections);
                }, 1000 / 4);

                video.addEventListener("ended", async () => {
                    video.playbackRate = 1;
                    video.muted = false;
                    clearInterval(intervalId);
                    setIsProcessing(false);
                    console.log('detections', faceDetector.current);
                });
            }

            setIsProcessing(true);
            await detectFace();


            onPlay = () => {
                const intervalId = setInterval(() => {
                    if (index < faceDetector.current.length) {
                        // console.log('drawing');

                        drawFabVideoClipPath(faceDetector.current[index]);
                        index++;
                    } else {
                        index = 0;
                        clearInterval(intervalId);
                    }
                }, 1000);

                intervalIds.current.push(intervalId);
            }

            onPause = () => {
                console.log('paused');
                intervalIds.current.forEach((id) => {
                    clearInterval(id);
                });
                intervalIds.current = [];
                // console.log(intervalIds.current);
            }

            onSeek = () => {
                console.log('seeked', video.currentTime);
                faceDetector.current.forEach(({ currentTime }, i) => {
                    if (video.currentTime >= (currentTime - 1) && video.currentTime <= (currentTime + 1)) {
                        index = i;
                    }
                });
                console.log(index);
            }

            video.addEventListener('play', onPlay);
            video.addEventListener('pause', onPause);
            video.addEventListener('seeked', onSeek);
        }

        processVideo();

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('seeked', onSeek);
        }
    }, [isFaceDetecting.detecting, videoRef]);

    // useEffect(() => {
    //     console.log('time update');
    //     intervalIds.current.forEach((id) => {
    //         clearInterval(id);
    //     });
    //     intervalIds.current = [];
    // }, [isSeeked]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                height={0}
                width={0}
            // className="absolute inset-0 z-50 object-contain object-center w-full h-full bg-transparent pointer-events-none"
            />

            <div className="fixed right-0 z-50 pr-5 top-20">
                <FaceDetectButton isFaceDetecting={isFaceDetecting} setIsFaceDetecting={setIsFaceDetecting} />
            </div>
            <Processing open={isProcessing} />
        </>
    );
};

export default FaceDetectionCanvas;


const customiseDetections = (detections, currentTime, leftMargin = 10) => {
    return detections.map((d) => {
        const leftModified = Math.round(d.box.left / leftMargin) * leftMargin;
        const detection = {
            left: leftModified,
            width: d.box.width,
            currentTime
        }
        return detection;
    })
}
