import { IconButton, Tooltip } from "@material-tailwind/react";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useVideoContext } from "../hooks/useVideoContext";


const ResetButton = () => {
    const { setVideoFile } = useVideoContext();
    const navigate = useNavigate();

    const onCancel = () => {
        setVideoFile(null);
        navigate('/');
    }

    return (
        <Tooltip content="Close" placement="left" className="hidden text-black bg-white sm:block">
            <IconButton
                variant="text"
                color="white"
                className='block ml-auto mr-4 transition duration-500 rounded-full shadow hover:scale-125'
                onClick={onCancel}
            >
                <FaXmark className="w-6 h-6" />
            </IconButton>
        </Tooltip>
    )
}

export default ResetButton;