
import { IconButton, Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { TbHandClick } from "react-icons/tb";
import { TbFaceMaskOff } from "react-icons/tb";
import { TbFaceId } from "react-icons/tb";

const FaceDetectButton = ({ isFaceDetecting, setIsFaceDetecting }) => {
    const [showBadge, setShowBadge] = useState(true);

    const toggleFaceDetectMode = () => {
        setShowBadge(false);
        setIsFaceDetecting(prev => ({
            detecting: !prev.detecting
        }));
    };

    return (
        <div className='relative flex items-end justify-center'>
            <Tooltip
                placement="left"
                content={isFaceDetecting.detecting ? "Disable Face Recoginition" : "Enable Face Recoginition"}
                className="hidden text-black bg-white sm:block">
                <IconButton
                    variant={isFaceDetecting.detecting ? "filled" : "text"}
                    color={isFaceDetecting.detecting ? "amber" : "white"}
                    className={`mb-2 transition duration-500 rounded-full shadow hover:scale-125 active:scale-95 ${isFaceDetecting.detecting ? "animate-pulse scale-110 p-5" : ""}`}
                    size="md"
                    onClick={toggleFaceDetectMode}
                >
                    {isFaceDetecting.detecting
                        ? <TbFaceId className="w-7 h-7" />
                        : <TbFaceMaskOff className="w-7 h-7" />}
                </IconButton>
            </Tooltip>
            {showBadge && <div className="absolute flex items-center -top-10 right-full w-[170px] bg-gradient-to-tr from-black/70 to-gray-300/30 shadow text-white rounded-md p-3 animate-bounce  pointer-events-none">
                <span>
                    Click here for face recognition
                </span>   <TbHandClick className="w-10 h-10 rotate-[140deg]" />
            </div>}
        </div>
    )
}

export default FaceDetectButton;