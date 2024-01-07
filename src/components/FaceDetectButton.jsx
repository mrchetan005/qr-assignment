
import { IconButton } from "@material-tailwind/react";
import { useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { TbHandClick } from "react-icons/tb";

const FaceDetectButton = ({ isFaceDetecting, setIsFaceDetecting }) => {
    const [showBadge, setShowBadge] = useState(true);

    const toggleFaceDetectMode = () => {
        setShowBadge(false);
        setIsFaceDetecting(!isFaceDetecting);
    };

    return (
        <div className='relative flex items-end justify-center'>
            <IconButton
                variant={isFaceDetecting ? "filled" : "text"}
                color={isFaceDetecting ? "amber" : "white"}
                className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                size="md"
                onClick={toggleFaceDetectMode}
            >
                <FaRobot className="w-7 h-7" />
            </IconButton>
            {showBadge && <div className="absolute flex items-center -top-10 right-full w-[170px] bg-gradient-to-tr from-black/70 to-gray-300/30 shadow text-white rounded-md p-3 animate-bounce">
                <span>
                    Click here for face recognition
                </span>   <TbHandClick className="w-10 h-10 rotate-[140deg]" />
            </div>}
        </div>
    )
}

export default FaceDetectButton;