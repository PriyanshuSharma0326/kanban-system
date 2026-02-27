import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { ROUTES } from "./features/nav/navSlice";
import { fetchBoard, resetBoard } from "./features/board/boardSlice";

import Rail      from "./components/layout/Rail";
import TaskPanel from "./components/board/TaskPanel";
import AuthPage  from "./pages/AuthPage";

import Board        from "./components/board/Board";
import Dashboard    from "./pages/Dashboard";
import SearchPage   from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import Header       from "./components/layout/Header";

const PAGE_TITLES = {
    [ROUTES.BOARD]:     "Kanban Board",
    [ROUTES.DASHBOARD]: "Dashboard",
    [ROUTES.SEARCH]:    "Search",
    [ROUTES.SETTINGS]:  "Settings",
};

export default function App() {
    const dispatch   = useDispatch();
    const current    = useSelector(state => state.nav.current);
    const authStatus = useSelector(state => state.auth.status);
    const user       = useSelector(state => state.auth.user);

    useEffect(() => {
        if (authStatus === "authenticated" && user?.uid) {
            dispatch(fetchBoard(user.uid));
        }
        if (authStatus === "unauthenticated") {
            dispatch(resetBoard());
        }
    }, [authStatus, user?.uid, dispatch]);

    if (authStatus === "idle" || authStatus === "loading") {
        return (
            <div className="h-screen w-screen bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
            </div>
        );
    }

    if (authStatus === "unauthenticated") return <AuthPage />;

    const isBoard = current === ROUTES.BOARD;

    return (
        <div className="h-screen w-screen bg-slate-100 flex overflow-hidden">
            <Rail />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header current={current} PAGE_TITLES={PAGE_TITLES} />

                {/*
                    Board: scrolls horizontally (columns side by side),
                           each Column handles its own vertical scroll internally.
                    Other pages: normal vertical scroll.
                */}
                <main className={`flex-1 p-6 ${isBoard ? "overflow-x-auto overflow-y-hidden" : "overflow-y-auto overflow-x-hidden"}`}>
                    {current === ROUTES.BOARD     && <Board />}
                    {current === ROUTES.DASHBOARD && <Dashboard />}
                    {current === ROUTES.SEARCH    && <SearchPage />}
                    {current === ROUTES.SETTINGS  && <SettingsPage />}
                </main>
            </div>

            <TaskPanel />
        </div>
    );
}
