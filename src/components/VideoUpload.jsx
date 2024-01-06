import { Button } from "@material-tailwind/react";

const VideoUploader = ({ onVideoSelected }) => {
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        onVideoSelected(file);
    };

    return (
        <Button variant="filled" color="deep-purple" className="h-10 p-0 transition duration-500 hover:scale-105 sm:text-lg">
            <label htmlFor="file" className="p-4 cursor-pointer">
                <input id="file" className="hidden" type="file" accept="video/*" onChange={handleVideoChange} />
                Upload Video
            </label>
        </Button>
    );
};

export default VideoUploader