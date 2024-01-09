
import { useEffect, useState } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { IconButton, Tooltip } from "@material-tailwind/react";

function startFullScreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

const FullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        isFullScreen ? exitFullScreen() : startFullScreen();
    };

    useEffect(() => {
        return () => {
            if (isFullScreen) {
                exitFullScreen();
            }
        }
    }, []);

    return (
        <div className='flex items-end justify-center'>
            <Tooltip content={isFullScreen ? "Exit Full Screen" : "Full Screen"} className="hidden text-black bg-white sm:block">
                <IconButton
                    variant="text"
                    color="white"
                    className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                    size="md"
                    onClick={toggleFullScreen}
                >
                    {isFullScreen
                        ? <MdFullscreenExit className="w-7 h-7" />
                        : <MdFullscreen className="w-7 h-7" />
                    }
                </IconButton>
            </Tooltip>
        </div>
    )
}


export default FullScreen;