export default function BottomTab({ children, active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
                active ? "text-violet-400" : "text-slate-500 hover:text-slate-300"
            }`}
        >
            {children}

            <span className={`text-[10px] font-medium tracking-wide ${active ? "text-violet-400" : "text-slate-500"}`}>
                {label}
            </span>

            {active && <span className="absolute bottom-0 w-8 h-0.5 bg-violet-400 rounded-full" />}
        </button>
    );
}
