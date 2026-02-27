import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
    closeTaskPanel,
    deleteTaskThunk,
    updateTaskThunk,
    createTask,
} from "../../features/board/boardSlice";
import ConfirmModal from "../common/ConfirmModal";
import { BLANK, LABELS, PRIORITIES, PRIORITY_COLORS } from "../../utils/constants";


export default function TaskPanel() {
    const dispatch = useDispatch();

    const uid = useSelector(state => state.auth.user?.uid);

    const { panelMode, panelColumnId, activeTaskId, members: users } = useSelector(state => state.board);

    const reduxTask = useSelector(state => activeTaskId ? state.board.tasks[activeTaskId] : null);

    const panelRef = useRef(null);

    const [draft, setDraft]   = useState(BLANK);
    const [isDirty, setIsDirty] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (panelMode === "edit" && reduxTask) {
            setDraft({
                title: reduxTask.title,
                description: reduxTask.description ?? "",
                priority: reduxTask.priority,
                label: reduxTask.label,
                assignees: [...(reduxTask.assignees ?? [])],
                dueDate: reduxTask.dueDate ?? null,
            });

            setIsDirty(false);
        }
        else if (panelMode === "create") {
            setDraft(BLANK);
            setIsDirty(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelMode, activeTaskId]);

    useEffect(() => {
        if (!showDeleteConfirm) {
            function onKey(e) { 
                if (e.key === "Escape") {
                    dispatch(closeTaskPanel());
                }
            }

            document.addEventListener("keydown", onKey);

            return () => document.removeEventListener("keydown", onKey);
        }
    }, [dispatch, showDeleteConfirm]);

    function patch(updates) { 
        setDraft(prev => ({ ...prev, ...updates }));
        setIsDirty(true); 
    }

    function toggleAssignee(userId) {
        setDraft(prev => ({
            ...prev,
            assignees: prev.assignees.includes(userId)
                ? prev.assignees.filter(id => id !== userId)
                : [...prev.assignees, userId],
        }));
        setIsDirty(true);
    }

    function handleSave() {
        if (!draft.title.trim() || !uid) return;

        if (panelMode === "edit") {
            dispatch(updateTaskThunk({ uid, taskId: activeTaskId, updates: draft }));
        } 
        else {
            dispatch(createTask({
                uid,
                columnId: panelColumnId,
                task: { id: `task-${Date.now()}`, ...draft, title: draft.title.trim() },
            }));
        }

        dispatch(closeTaskPanel());
    }

    if (!panelMode) return null;

    const isCreate = panelMode === "create";

    return (
        <>
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex justify-end z-50"
                onClick={e => { if (panelRef.current && !panelRef.current.contains(e.target)) dispatch(closeTaskPanel()); }}
            >
                <div
                    ref={panelRef}
                    className="
                        w-full md:w-[420px] bg-white h-full shadow-2xl flex flex-col
                        md:animate-slideIn
                        animate-slideUp
                    "
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center px-5 md:px-6 py-4 border-b border-slate-100 flex-shrink-0">
                        <h2 className="text-sm font-semibold text-slate-700">{isCreate ? "New Task" : "Edit Task"}</h2>

                        <div className="flex items-center gap-3">
                            {!isCreate && (
                                <button onClick={() => setShowDeleteConfirm(true)} className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                                    Delete
                                </button>
                            )}

                            <button onClick={() => dispatch(closeTaskPanel())} className="h-7 w-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition text-sm">✕</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 flex flex-col gap-5">
                        <input
                            value={draft.title}
                            onChange={e => patch({ title: e.target.value })}
                            placeholder="Task title..."
                            autoFocus={isCreate}
                            className="w-full text-xl font-semibold outline-none text-slate-800 placeholder-slate-300 border-b border-transparent focus:border-slate-200 pb-1 transition-colors"
                        />

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</label>

                            <textarea value={draft.description} onChange={e => patch({ description: e.target.value })} placeholder="Add a description..." className="w-full mt-2 text-sm bg-slate-50 rounded-xl p-3 outline-none resize-none text-slate-700 placeholder-slate-300 focus:bg-slate-100 transition-colors" rows={4} />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Priority</label>

                            <div className="flex gap-2 mt-2">
                                {PRIORITIES.map(p => (
                                    <button key={p} onClick={() => patch({ priority: p })}
                                        className={`flex-1 text-xs px-3 py-2 rounded-lg transition font-medium border ${draft.priority === p ? `${PRIORITY_COLORS[p]} shadow-sm` : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Label</label>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {LABELS.map(l => (
                                    <button key={l.name} onClick={() => patch({ label: l.name })}
                                        className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${draft.label === l.name ? "bg-slate-800 text-white shadow-sm" : `${l.color} hover:opacity-70`}`}>
                                        {l.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Assignees</label>

                            <div className="mt-2 flex flex-col gap-1">
                                {Object.values(users).map(user => {
                                    const assigned = draft.assignees.includes(user.id);
                                    const isHex    = user.avatarColor?.startsWith("#");

                                    return (
                                        <button key={user.id} onClick={() => toggleAssignee(user.id)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${assigned ? "bg-violet-50 text-violet-700" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                                        >
                                            <div
                                                className={`h-6 w-6 rounded-full flex-shrink-0 ${!isHex ? user.avatarColor : ""}`}
                                                style={isHex ? { backgroundColor: user.avatarColor } : {}}
                                            />

                                            <span className="font-medium">{user.name}</span>

                                            <span className={`ml-auto text-xs rounded-full px-2 py-0.5 ${assigned ? "bg-violet-100 text-violet-600" : "bg-slate-200 text-slate-400"}`}>
                                                {assigned ? "Assigned" : "Unassigned"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Due Date</label>

                            <div className="mt-2 flex items-center gap-2">
                                <input type="date" value={draft.dueDate || ""} onChange={e => patch({ dueDate: e.target.value || null })}
                                    className="flex-1 text-sm bg-slate-50 rounded-lg px-3 py-2.5 outline-none border border-slate-200 focus:border-violet-300 transition-colors text-slate-700" 
                                />

                                {draft.dueDate && (
                                    <button onClick={() => patch({ dueDate: null })} className="text-xs text-slate-400 hover:text-red-400 transition">Clear</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-5 md:px-6 py-4 border-t border-slate-100 flex-shrink-0 flex items-center gap-3 pb-safe">
                        <button
                            onClick={handleSave}
                            disabled={!draft.title.trim()}
                            className={`flex-1 py-3 md:py-2.5 rounded-xl text-sm font-semibold transition ${draft.title.trim() ? "bg-violet-500 text-white hover:bg-violet-600 shadow-md shadow-violet-500/20 active:scale-[0.98]" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                        >
                            {isCreate ? "Create Task" : isDirty ? "Save Changes" : "Saved"}
                        </button>

                        <button onClick={() => dispatch(closeTaskPanel())} className="px-4 py-3 md:py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition">Cancel</button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete task?"
                message={reduxTask ? `"${reduxTask.title}" will be permanently removed.` : ""}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    if (uid) dispatch(deleteTaskThunk({ uid, taskId: activeTaskId }));
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
