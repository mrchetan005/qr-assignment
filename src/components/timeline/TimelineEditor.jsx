import { Timeline } from "@xzdarcy/react-timeline-editor";
import PlayPauseButton from "../Actions/PlayPauseButton";
import SpeedController from "../Actions/SpeedController";
import Volume from "../Actions/Volume";
import { useEffect, useState } from "react";
import { editorData } from "../../constants";

import './timelline-editor.css';
import { useVideoContext } from "../../hooks/useVideoContext";


const TimelineEditor = () => {
    const [data, setData] = useState(editorData);
    const { videoRef } = useVideoContext();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
    }, [videoRef]);

    return (
        <div className="text-white">
            <div className="flex items-center gap-4 p-5">
                <PlayPauseButton />
                <Volume />
                <SpeedController />
            </div>
            <div className="w-full">
                <Timeline
                    scale={1}
                    editorData={data}
                    onChange={() => { }}
                    effects={{}}
                    // gridSnap={true}
                    // scaleSplitCount={20}
                    autoScroll={true}
                    dragLine={true}
                    hideCursor={false}
                />
            </div>
        </div>
    )
}

export default TimelineEditor;