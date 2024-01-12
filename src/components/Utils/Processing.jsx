
import { Dialog, DialogHeader, Spinner } from "@material-tailwind/react";

const Processing = ({ open }) => {

    return (
        <>
            <Dialog open={open} className="px-5 text-lg bg-black w-max">
                <DialogHeader className="flex items-center gap-5 text-white">
                    <Spinner />
                    Processing the video...
                </DialogHeader>
            </Dialog>
        </>
    );
}

export default Processing;