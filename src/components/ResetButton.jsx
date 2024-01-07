import { IconButton } from "@material-tailwind/react";
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
        <>

            {/* <div className='absolute top-0 left-0 right-0 pt-3 pb-2 pr-2 bg-gradient-to-b from-black/75 to-transparent'> */}
            <IconButton
                variant="text"
                color="white"
                className='block ml-auto transition duration-500 rounded-full shadow hover:scale-125'
                onClick={onCancel}
            >
                <FaXmark className="w-6 h-6" />
            </IconButton>
            {/* </div> */}
        </>
    )
}

export default ResetButton;