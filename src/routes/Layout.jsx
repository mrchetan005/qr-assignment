import { Outlet } from "react-router-dom";

const Layout = () => {

    return (
        <div className="relative w-full h-screen sm:aspect-auto">
            <Outlet />
        </div>
    )
}

export default Layout;