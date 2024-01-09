import { Button } from "@material-tailwind/react";
import { FaVideo } from "react-icons/fa6";

const VideoUploader = ({ onVideoSelected }) => {
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        onVideoSelected(file);
    };

    return (

        <Button variant="filled" color="deep-purple" className="h-10 p-0 py-1 text-lg transition-all duration-300 rounded-full hover:text-amber-100 bg-gradient-to-r hover:bg-gradient-to-l from-gray-700 to-gray-800 active:scale-95 text-amber-300">
            <label htmlFor="file" className="flex items-center justify-center gap-4 p-1 px-6 transition-all duration-300 cursor-pointer hover:scale-95">
                <input
                    multiple={false}
                    id="file"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoChange}
                />
                Get Started
                <FaVideo className="w-6 h-6" />
            </label>
        </Button>

    );
};

export default VideoUploader;