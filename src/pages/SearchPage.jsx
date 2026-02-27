import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigate, ROUTES } from "../features/nav/navSlice";
import { openTaskPanel as openPanel } from "../features/board/boardSlice";

const labelColors = {
    Design:      "bg-sky-100 text-sky-600",
    Development: "bg-emerald-100 text-emerald-600",
    Marketing:   "bg-pink-100 text-pink-600",
    General:     "bg-slate-100 text-slate-600",
};

const priorityColors = {
    Low:    "bg-emerald-100 text-emerald-600",
    Medium: "bg-amber-100 text-amber-600",
    High:   "bg-red-100 text-red-600",
};

export default function SearchPage() {
    const dispatch = useDispatch();
    const { tasks, columns } = useSelector(state => state.board);
    const [query, setQuery] = useState("");

    const allTasks = Object.values(tasks);

    // Find which column a task belongs to
    function findColumnTitle(taskId) {
        const col = Object.values(columns).find(c => c.tasks.includes(taskId));
        return col?.title ?? "—";
    }

    const results = query.trim().length === 0
        ? []
        : allTasks.filter(t => {
            const q = query.toLowerCase();
            return (
                t.title.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.label?.toLowerCase().includes(q) ||
                t.priority?.toLowerCase().includes(q)
            );
        });

    function handleOpen(taskId) {
        dispatch(navigate(ROUTES.BOARD));
        // Small delay so Board mounts before panel opens
        setTimeout(() => dispatch(openPanel(taskId)), 50);
    }

    return (
        <div className="max-w-2xl mx-auto py-2">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Search</h2>

            {/* Search input */}
            <div className="relative mb-6">
                <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search tasks by title, description, label or priority..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none text-sm text-slate-800 placeholder-slate-400 focus:border-violet-300 transition-colors"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Results */}
            {query.trim().length > 0 && (
                <div>
                    <p className="text-xs text-slate-400 mb-3">
                        {results.length === 0
                            ? "No tasks match your search."
                            : `${results.length} result${results.length !== 1 ? "s" : ""}`}
                    </p>

                    <div className="flex flex-col gap-2">
                        {results.map(task => (
                            <button
                                key={task.id}
                                onClick={() => handleOpen(task.id)}
                                className="w-full text-left bg-white rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-violet-200"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">
                                            <Highlight text={task.title} query={query} />
                                        </p>
                                        {task.description && (
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                <Highlight text={task.description} query={query} />
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
                                        {findColumnTitle(task.id)}
                                    </span>
                                </div>
                                <div className="flex gap-1.5 mt-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${labelColors[task.label] ?? "bg-slate-100 text-slate-600"}`}>
                                        {task.label}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority] ?? "bg-slate-100 text-slate-600"}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {query.trim().length === 0 && (
                <div className="text-center py-16 text-slate-400">
                    <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <p className="text-sm">Type to search across all tasks</p>
                </div>
            )}
        </div>
    );
}

// Highlights matching substring in text
function Highlight({ text, query }) {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-violet-100 text-violet-700 rounded px-0.5">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}
