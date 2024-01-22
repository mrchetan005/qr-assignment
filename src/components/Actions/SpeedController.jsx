import {
    Menu,
    MenuHandler,
    Button,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { useState } from "react";
import { useVideoContext } from "../../hooks/useVideoContext";
import { FaChevronDown } from "react-icons/fa6";

const SpeedController = () => {
    const [selected, setSelected] = useState(1);
    const { videoRef } = useVideoContext();

    const handleSpeed = (speed) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = speed;
        setSelected(speed);
    }

    return (
        <Menu allowHover>
            <MenuHandler>
                <Button variant="text" color="white" className="flex items-center gap-3 px-3 font-medium capitalize group">
                    <span>Speed {selected}x </span>
                    <FaChevronDown className="w-3 h-3 text-white transition-all group-hover:rotate-180" />
                </Button>
            </MenuHandler>
            <MenuList className="p-1 h-32 customScrollbar border-[#585757aa]" >
                {menuItems.map((speed) => (
                    <MenuItem className="w-full" key={speed} onClick={() => handleSpeed(speed)}>Speed {speed}x</MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

export default SpeedController;

const menuItems = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
