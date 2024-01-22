

const Wrapper = ({ children }) => {

    return (
        <aside
            className="relative left-0 flex flex-col w-80 h-screen text-white border-r border-[#2c2c32] z-50"

        >
            {children}
        </aside>
    )
}

export default Wrapper;