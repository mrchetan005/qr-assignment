import { useEffect, useRef, useState } from 'react';
import { useVideoContext } from '../hooks/useVideoContext';
// import FaceDetectButton from './Utils/FaceDetectButton';
import { fabric } from 'fabric';
import Processing from './Utils/Processing';
import api from '../api';


const FaceDetectionCanvas = () => {
    // const [isFaceDetecting, setIsFaceDetecting] = useState({ detecting: false });
    const [isProcessing, setIsProcessing] = useState(false);
    const [detections, setDetections] = useState([]);
    const fabVideo = useRef(null);
    const { videoRef, canvasRef, videoFile } = useVideoContext();
    const fabCanvas = useRef(null);
    const animationFrame = useRef(null);
    let intervalIds = useRef([]);

    let verticalVideoCanvasWidth = 9 / 16 * fabCanvas.current?.height;

    const createAndRenderCanvas = async () => {
        const video = videoRef.current;

        if (!video) {
            console.log('video not found');
            return;
        }

        fabCanvas.current = null;
        const aspectRatio = video.videoWidth / video.videoHeight;

        fabCanvas.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: "gray",
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
        });

        console.log('video => ', video);

        const videoCanvas = new fabric.Image(video, {
            left: 0,
            top: 0,
            width: video.videoWidth,
            height: video.videoHeight,
            scaleX: fabCanvas.current.width / video.videoWidth,
            scaleY: fabCanvas.current.height / video.videoHeight,
            clipPath,
            backgroundColor: "green",
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
        if (!coord?.length) return;

        coord.forEach(({ x1, width }) => {
            fabVideo.current.set({
                top: 0,
                left: -x1 + (width > (verticalVideoCanvasWidth / 2) ? -width / 8 : width / 2),
            });

            fabCanvas.current.add(fabVideo.current);
            fabCanvas.current.bringToFront(fabVideo.current);
            fabCanvas.current.setActiveObject(fabVideo.current);
            // console.log('draw');
        });
    }

    const getDetections = async () => {
        try {
            setIsProcessing(true);
            const formdata = new FormData();
            formdata.append('file', videoFile);
            formdata.append('height', fabCanvas.current.height);
            formdata.append('width', fabCanvas.current.width);
            const data = await api.post(`/detect`, formdata);
            // console.log('detections',data.data.detections.boxes);
            setDetections(data.data.detections.boxes);
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    console.log('detections', detections);


    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            console.log('video not found');
            return;
        }

        const onLoaded = async () => {
            console.log('video loaded');
            createAndRenderCanvas();
            await getDetections();
        }

        const onPlay = () => {
            const currentTime = Math.round(video.currentTime);
            // console.log('currenttime', currentTime, detections);
            drawFabVideoClipPath(detections[currentTime]);
            const intervalId = setInterval(() => {
                const currentTime = Math.round(video.currentTime);
                drawFabVideoClipPath(detections[currentTime]);
            }, 1000);

            intervalIds.current.push(intervalId);
        }

        const onPause = () => {
            intervalIds.current.forEach((id) => {
                clearInterval(id);
            });
        }

        const onSeek = () => {
            intervalIds.current.forEach((id) => {
                clearInterval(id);
            });
            onPlay();
        }

        video.addEventListener('loadeddata', onLoaded);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('seeked', onSeek);

        return () => {
            video.removeEventListener('loadeddata', onLoaded);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('seeked', onSeek);
        }
    }, [detections]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                height={0}
                width={0}
            />

            {/* <div className="fixed right-0 z-50 pr-5 top-20">
                <FaceDetectButton isFaceDetecting={isFaceDetecting} setIsFaceDetecting={setIsFaceDetecting} />
            </div> */}
            <Processing open={isProcessing} />
        </>
    );
};

export default FaceDetectionCanvas;
