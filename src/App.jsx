import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { ROUTES } from "./features/nav/navSlice";
import { fetchBoard, resetBoard } from "./features/board/boardSlice";

import Rail from "./components/layout/rail/Rail";
import TaskPanel from "./components/board/TaskPanel";
import AuthPage from "./pages/auth/AuthPage";
import Board from "./components/board/Board";
import Dashboard from "./pages/Dashboard";
import SearchPage   from "./pages/search/SearchPage";
import SettingsPage from "./pages/settings/SettingsPage";
import Header from "./components/layout/Header";

import Loading from './assets/Loading.svg';

const PAGE_TITLES = {
    [ROUTES.BOARD]: "Kanban Board",
    [ROUTES.DASHBOARD]: "Dashboard",
    [ROUTES.SEARCH]: "Search",
    [ROUTES.SETTINGS]: "Settings",
};

export default function App() {
    const dispatch = useDispatch();

    const current = useSelector(state => state.nav.current);
    const { user, status: authStatus } = useSelector(state => state.auth);

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
                <img src={Loading} alt="" className="w-6 h-6 animate-spin text-violet-500" />
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

                <main className={`flex-1 ${
                    isBoard
                        ? "overflow-x-auto overflow-y-hidden p-4 md:p-6"
                        : "overflow-y-auto overflow-x-hidden px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6"
                }`}>
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
