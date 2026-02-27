import { useSelector, useDispatch } from "react-redux";
import { LayoutDashboard, KanbanSquare, Search, Settings } from "lucide-react";
import { navigate, ROUTES } from "../../features/nav/navSlice";
import Logo from '../../assets/logo.svg';

export default function Rail() {
    const dispatch = useDispatch();
    const current  = useSelector(state => state.nav.current);

    function go(route) {
        dispatch(navigate(route));
    }

    return (
        <aside className="w-16 bg-slate-900 text-slate-400 flex flex-col items-center py-4 flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-violet-500 mb-6 flex items-center justify-center flex-shrink-0">
                <img src={Logo} alt="" />
            </div>

            <nav className="flex flex-col gap-2">
                <RailButton
                    active={current === ROUTES.BOARD}
                    onClick={() => go(ROUTES.BOARD)}
                    label="Board"
                >
                    <KanbanSquare size={18} />
                </RailButton>

                <RailButton
                    active={current === ROUTES.DASHBOARD}
                    onClick={() => go(ROUTES.DASHBOARD)}
                    label="Dashboard"
                >
                    <LayoutDashboard size={18} />
                </RailButton>

                <RailButton
                    active={current === ROUTES.SEARCH}
                    onClick={() => go(ROUTES.SEARCH)}
                    label="Search"
                >
                    <Search size={18} />
                </RailButton>
            </nav>

            <div className="mt-auto">
                <RailButton
                    active={current === ROUTES.SETTINGS}
                    onClick={() => go(ROUTES.SETTINGS)}
                    label="Settings"
                >
                    <Settings size={18} />
                </RailButton>
            </div>
        </aside>
    );
}

function RailButton({ children, active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`
                relative group
                h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-150
                ${active
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}
            `}
        >
            {children}

            <span className="
                pointer-events-none absolute left-14 z-50
                whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5
                text-xs font-medium text-white shadow-lg
                opacity-0 group-hover:opacity-100
                translate-x-1 group-hover:translate-x-0
                transition-all duration-150
            ">
                {label}
            </span>
        </button>
    );
}
