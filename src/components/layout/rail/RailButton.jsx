export default 

function RailButton({ children, active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`
                relative group h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-150
                ${active ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}
            `}
        >
            {children}

            <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150">
                {label}
            </span>
        </button>
    );
}
