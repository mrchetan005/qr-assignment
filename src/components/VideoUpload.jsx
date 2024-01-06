const VideoUploader = ({ onVideoSelected }) => {
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        onVideoSelected(file);
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
        </div>
    );
};

export default VideoUploader