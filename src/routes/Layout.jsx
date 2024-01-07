import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import * as faceapi from 'face-api.js';


const Layout = () => {
    useEffect(() => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            faceapi.nets.ageGenderNet.loadFromUri('/models')
        ]).then(() => {
            console.log('loaded');
        })
    }, []);
    return (
        <div className="layout relative w-full sm:w-max flex items-center justify-center h-screen aspect-[9/16] m-auto">
            <Outlet />
        </div>
    )
}

export default Layout;