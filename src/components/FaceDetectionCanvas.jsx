import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useVideoContext } from '../hooks/useVideoContext';
import FaceDetectButton from './Utils/FaceDetectButton';
import { fabric } from 'fabric';
import Processing from './Utils/Processing';



const FaceDetectionCanvas = () => {
    const [isFaceDetecting, setIsFaceDetecting] = useState({ detecting: false });
    const [isProcessing, setIsProcessing] = useState(false);

    const [faceDetector, setFaceDetector] = useState([]);
    const [fabVideo, setFabVideo] = useState(null);
    const { videoRef, canvasRef } = useVideoContext();
    const fabCanvas = useRef(null);
    const animationFrame = useRef(null);

    let index = 0;
    let currentFabVideos = useRef([]);
    let intervalIds = [];

    const createAndRenderCanvas = () => {
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
            width: 360,
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
        setFabVideo(videoCanvas);

        const renderCanvas = () => {
            if (!fabCanvas.current) return;
            fabCanvas.current.renderAll();
            animationFrame.current = fabric.util.requestAnimFrame(renderCanvas);
        };

        renderCanvas();
    }

    const drawRect = (coord) => {
        if (currentFabVideos.current.length > 0 || coord.length === 0) {
            // currentFabVideos.current.forEach(curr => fabCanvas.current.remove(curr));
        }

        console.log(currentFabVideos.current);

        coord.forEach(({ box }) => {
            const clipPathRect = new fabric.Rect({
                left: box?.left,
                top: 0,
                right: box?.right,
                width: 360 - 20,
                height: canvasRef.current.height,
                absolutePositioned: true
            });

            fabVideo.set({ clipPath: clipPathRect });

            fabCanvas.current.add(fabVideo);
            fabCanvas.current.bringToFront(fabVideo);
            fabCanvas.current.setActiveObject(fabVideo);
            console.log('draw');
            currentFabVideos.current.push(fabVideo);
        });
    }

    useEffect(() => {
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
                    console.log(resizedDetections);
                    setFaceDetector((item) => [...item, resizedDetections]);
                }, 1000 / 0.8);

                video.addEventListener("ended", async () => {
                    video.playbackRate = 1;
                    video.muted = false;
                    clearInterval(intervalId);
                    // await video.remove();
                    setIsProcessing(false);
                    createAndRenderCanvas();

                });
            }

            setIsProcessing(true);
            detectFace();

            console.log(faceDetector);

            onPlay = () => {
                const intervalId = setInterval(() => {
                    if (index < faceDetector.length) {
                        drawRect(faceDetector[index]);
                        index++;
                    } else {
                        clearInterval(intervalId);
                        if (currentFabVideos.current.length > 0) {
                            // currentFabVideos.current.forEach(curr => fabCanvas.current.remove(curr))
                        }
                    }
                }, 1000);

                intervalIds.push(intervalId);
            }

            onPause = () => {
                if (currentFabVideos.current.length > 0)
                    // currentFabVideos.current.forEach((curr) => fabCanvas.current.remove(curr));
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


/*
           
let rect = new fabric.Rect({
   left: 0,
   right: box?.left - 300,
   top: 0,
   width: box?.width + 40,
   height: fabCanvas.current.height,
   fill: "green",
   // stroke: "black",
   // strokeWidth: 2,
   // selectable: false,
   // cornerColor: "black",
   // cornerStrokeColor: "black",
   // borderColor: "black", 
   evented: false,
   selectable: false
});
let rect1 = new fabric.Rect({
   left: box?.right + 100,
   top: 0,
   width: box?.width + 640,
   height: fabCanvas.current.height,
   fill: "yellow",
   // stroke: "black",
   // strokeWidth: 2,
   // selectable: false,
   // cornerColor: "black",
   // cornerStrokeColor: "black",
   // borderColor: "black",
   evented: false,
   // selectable: false
});

fabCanvas.current.add(rect);
fabCanvas.current.add(rect1);
fabCanvas.current.bringToFront(rect);
fabCanvas.current.setActiveObject(rect);
currentFabVideos.push(rect);

*/
