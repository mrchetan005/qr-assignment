import { Button } from "@material-tailwind/react";
import { FaVideo } from "react-icons/fa6";

const VideoUploader = ({ onVideoSelected }) => {
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        onVideoSelected(file);
    };

    return (
        <Button variant="filled" color="deep-purple" className="h-10 p-0 px-6 py-1 text-lg text-white transition duration-500 rounded-full shadow hover:scale-125 bg-gradient-to-r hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-700 from-teal-500 to-indigo-700">
            <label htmlFor="file" className="flex items-center justify-center gap-4 p-1 cursor-pointer">
                <input
                    multiple={false}
                    id="file"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoChange}
                />Get Started
                <FaVideo className="w-6 h-6" />
            </label>
        </Button>
    );
};

export default VideoUploader;