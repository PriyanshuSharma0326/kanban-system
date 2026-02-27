import { useSelector, useDispatch } from "react-redux";
import { LayoutDashboard, KanbanSquare, Search, Settings } from "lucide-react";
import { navigate, ROUTES } from "../../../features/nav/navSlice";
import Logo from '../../../assets/Logo.svg';
import RailButton from "./RailButton";
import BottomTab from "./BottomTab";

export default function Rail() {
    const dispatch = useDispatch();
    const current  = useSelector(state => state.nav.current);

    function go(route) { 
        dispatch(navigate(route)); 
    }

    return (
        <>
            <aside className="hidden md:flex w-16 bg-slate-900 text-slate-400 flex-col items-center py-4 flex-shrink-0">
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

            <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-slate-800 flex items-stretch h-16 safe-area-pb">
                <BottomTab 
                    active={current === ROUTES.BOARD} 
                    onClick={() => go(ROUTES.BOARD)} 
                    label="Board"
                >
                    <KanbanSquare size={20} />
                </BottomTab>

                <BottomTab 
                    active={current === ROUTES.DASHBOARD} 
                    onClick={() => go(ROUTES.DASHBOARD)} 
                    label="Dashboard"
                >
                    <LayoutDashboard size={20} />
                </BottomTab>

                <BottomTab 
                    active={current === ROUTES.SEARCH} 
                    onClick={() => go(ROUTES.SEARCH)} 
                    label="Search"
                >
                    <Search size={20} />
                </BottomTab>

                <BottomTab 
                    active={current === ROUTES.SETTINGS} 
                    onClick={() => go(ROUTES.SETTINGS)} 
                    label="Settings"
                >
                    <Settings size={20} />
                </BottomTab>
            </nav>
        </>
    );
}
