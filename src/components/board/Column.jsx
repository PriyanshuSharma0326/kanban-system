import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDroppable } from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskCard from "./TaskCard";
import ConfirmModal from "../common/ConfirmModal";

import {
    renameColumnThunk,
    deleteColumnThunk,
    openTaskPanelForCreate,
} from "../../features/board/boardSlice";

export default function Column({ columnId, isDragOverlay = false }) {
    const dispatch = useDispatch();

    const uid = useSelector(state => state.auth.user?.uid);
    const column = useSelector(state => state.board.columns[columnId]);

    const {
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({ id: columnId });

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: columnId });

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!column) return null;

    function handleTitleBlur() {
        setIsEditingTitle(false);

        const trimmed = draftTitle.trim();

        if (!trimmed || trimmed === column.title || !uid) return;

        dispatch(renameColumnThunk({ uid, columnId, title: trimmed }));
    }

    function handleTitleKeyDown(e) {
        if (e.key === "Enter") {
            e.target.blur();
        }
        if (e.key === "Escape") {
            setIsEditingTitle(false);
        }
    }

    return (
        <>
            <div
                ref={(node) => { if (!isDragOverlay) { setNodeRef(node); setDroppableRef(node); } }}
                style={isDragOverlay ? {} : style}
                className={`
                    w-[80vw] max-w-[300px] sm:w-[260px] md:w-[280px]
                    flex-shrink-0 rounded-2xl p-3 flex flex-col transition-colors duration-150
                    ${isOver && !isDragOverlay ? "bg-violet-100/70 ring-2 ring-violet-300" : "bg-slate-200/50"}
                `}
            >
                <div className="flex items-center gap-2 mb-3">
                    {!isDragOverlay && (
                        <span
                            {...attributes} {...listeners}
                            className="outline-none flex-shrink-0 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none select-none"
                            title="Drag to reorder"
                        >⠿</span>
                    )}

                    {isEditingTitle ? (
                        <input
                            value={draftTitle}
                            onChange={e => setDraftTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            autoFocus
                            className="flex-1 text-sm font-semibold bg-white rounded px-1 outline-none ring-1 ring-violet-400"
                        />
                    ) : (
                        <h2
                            onDoubleClick={() => { setDraftTitle(column.title); setIsEditingTitle(true); }}
                            className="flex-1 text-sm font-semibold text-slate-700 cursor-pointer select-none truncate"
                            title="Double-click to rename"
                        >
                            {column.title}
                        </h2>
                    )}

                    <span className="flex-shrink-0 text-xs text-slate-500 bg-slate-300/60 px-2 py-0.5 rounded-full">
                        {column.tasks.length}
                    </span>

                    {!isDragOverlay && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-shrink-0 outline-none text-slate-300 hover:text-red-400 transition text-xs"
                            title="Delete column"
                        >✕</button>
                    )}
                </div>

                <SortableContext items={column.tasks} strategy={verticalListSortingStrategy}>
                    <div
                        className="flex flex-col gap-3 min-h-[40px] overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-220px)] rounded-xl"
                        style={{ boxShadow: "inset 0 8px 12px -6px rgba(0,0,0,0.06), inset 0 -8px 12px -6px rgba(0,0,0,0.06)" }}
                    >
                        {column.tasks.length === 0 ? (
                            <div className="text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl p-3 text-center">
                                Drop tasks here
                            </div>
                        ) : (
                            column.tasks.map(taskId => <TaskCard key={taskId} id={taskId} />)
                        )}
                    </div>
                </SortableContext>

                {!isDragOverlay && (
                    <button
                        onClick={() => dispatch(openTaskPanelForCreate(columnId))}
                        className="mt-3 text-sm text-slate-500 hover:text-violet-600 hover:bg-white/40 rounded-lg py-1 transition"
                    >
                        + Add Task
                    </button>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete column?"
                message={`"${column.title}" and all ${column.tasks.length} task${column.tasks.length !== 1 ? "s" : ""} inside will be permanently removed.`}
                confirmLabel="Delete Column"
                variant="danger"
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    if (uid) dispatch(deleteColumnThunk({ uid, columnId, taskIds: column.tasks }));
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
