
import { IconButton } from "@material-tailwind/react";
import { FaRobot } from "react-icons/fa6";
// import { useVideoContext } from "../hooks/useVideoContext";


const FaceDetectButton = ({ isFaceDetecting, setIsFaceDetecting }) => {
    // const { isFaceDetecting, setIsFaceDetecting } = useVideoContext();

    const toggleFaceDetectMode = () => {
        console.log('fac det btn', isFaceDetecting);
        setIsFaceDetecting(!isFaceDetecting);
    };

    return (
        <div className='flex items-end justify-center'>
            <IconButton
                variant={isFaceDetecting ? "filled" : "text"}
                color={isFaceDetecting ? "amber" : "white"}
                className='mb-2 transition duration-500 rounded-full shadow hover:scale-125'
                size="md"
                onClick={toggleFaceDetectMode}
            >
                <FaRobot className="w-7 h-7" />
            </IconButton>
        </div>
    )
}

export default FaceDetectButton;