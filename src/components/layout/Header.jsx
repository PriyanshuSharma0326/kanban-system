import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ current, PAGE_TITLES }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const formatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr   = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

    return (
        <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between flex-shrink-0 relative bg-white">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60" />

            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100" />

            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300 tracking-widest uppercase select-none hidden sm:block">
                    App
                </span>

                <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:block" strokeWidth={2} />

                <h1 className="text-sm font-semibold text-slate-700 tracking-tight">
                    {PAGE_TITLES[current]}
                </h1>

                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 opacity-80 ml-0.5" />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs text-slate-400 font-medium tracking-wide hidden sm:block">
                    {dateStr}
                </span>

                <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

                <span className="text-xs font-semibold text-slate-500 tabular-nums tracking-widest">
                    {formatted}
                </span>
            </div>
        </header>
    );
}
