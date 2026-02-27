import Column from "./Column";
import TaskCard from "./TaskCard";

import { DndContext, DragOverlay, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import { useDispatch, useSelector } from "react-redux";
import {
    optimisticMoveTask,
    optimisticReorderTasks,
    optimisticReorderColumns,
    moveTaskThunk,
    reorderTasksThunk,
    saveColumnOrder,
    createColumn,
} from "../../features/board/boardSlice";
import LoadingIcon from '../../assets/Loading.svg';
import { useState } from "react";

function customCollision(args) {
    const p = pointerWithin(args);

    return p.length > 0 ? p : rectIntersection(args);
}

export default function Board() {
    const dispatch = useDispatch();

    const uid = useSelector(state => state.auth.user?.uid);

    const { columns, columnOrder, status } = useSelector(state => state.board);

    const [activeTaskId,   setActiveTaskId] = useState(null);
    const [activeColumnId, setActiveColumnId] = useState(null);

    const orderedColumns = columnOrder.map(id => columns[id]).filter(Boolean);

    function findColumnOfTask(taskId) {
        return Object.values(columns).find(col => col.tasks.includes(taskId));
    }

    function handleDragStart({ active }) {
        if (active.id in columns) setActiveColumnId(active.id);
        else setActiveTaskId(active.id);
    }

    function handleDragCancel() {
        setActiveTaskId(null);
        setActiveColumnId(null);
    }

    function handleDragEnd({ active, over }) {
        setActiveTaskId(null);
        setActiveColumnId(null);

        if (!over || !uid) return;

        if (active.id in columns) {
            if (!(over.id in columns)) return;

            const oldIdx = columnOrder.indexOf(active.id);
            const newIdx = columnOrder.indexOf(over.id);

            if (oldIdx === newIdx) return;

            const newOrder = arrayMove(columnOrder, oldIdx, newIdx);

            dispatch(optimisticReorderColumns(newOrder));
            dispatch(saveColumnOrder({ uid, columnOrder: newOrder }));

            return;
        }

        const sourceCol = findColumnOfTask(active.id);

        if (!sourceCol) return;

        if (over.id in columns) {
            if (sourceCol.id === over.id) return;

            const fromTasks = sourceCol.tasks.filter(id => id !== active.id);
            const toTasks   = [...columns[over.id].tasks, active.id];

            dispatch(optimisticMoveTask({ fromColumn: sourceCol.id, toColumn: over.id, taskId: active.id, newIndex: toTasks.length - 1 }));
            dispatch(moveTaskThunk({ uid, fromColumn: sourceCol.id, toColumn: over.id, taskId: active.id, fromTasks, toTasks }));

            return;
        }

        const targetCol = findColumnOfTask(over.id);

        if (!targetCol) return;

        if (sourceCol.id === targetCol.id) {
            const oldIdx = sourceCol.tasks.indexOf(active.id);
            const newIdx = targetCol.tasks.indexOf(over.id);

            if (oldIdx === newIdx) return;

            const items = arrayMove(sourceCol.tasks, oldIdx, newIdx);

            dispatch(optimisticReorderTasks({ columnId: sourceCol.id, items }));
            dispatch(reorderTasksThunk({ uid, columnId: sourceCol.id, items }));
        }
        else {
            const newIdx    = targetCol.tasks.indexOf(over.id);
            const fromTasks = sourceCol.tasks.filter(id => id !== active.id);
            const toTasks   = [...targetCol.tasks];

            toTasks.splice(newIdx, 0, active.id);

            dispatch(optimisticMoveTask({ fromColumn: sourceCol.id, toColumn: targetCol.id, taskId: active.id, newIndex: newIdx }));
            dispatch(moveTaskThunk({ uid, fromColumn: sourceCol.id, toColumn: targetCol.id, taskId: active.id, fromTasks, toTasks }));
        }
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm gap-2">
                <img src={LoadingIcon} alt="" className="w-6 h-6 animate-spin text-violet-500" />
                Loading your board…
            </div>
        );
    }

    return (
        <DndContext collisionDetection={customCollision} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-5 items-start">
                    {orderedColumns.map(column => (
                        <Column key={column.id} columnId={column.id} />
                    ))}

                    <button
                        onClick={() => uid && dispatch(createColumn({ uid, order: columnOrder.length }))}
                        className="w-[280px] flex-shrink-0 h-12 rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 hover:bg-white/40 hover:border-violet-300 hover:text-violet-500 transition-all duration-200"
                    >
                        + Add Column
                    </button>
                </div>
            </SortableContext>

            <DragOverlay>
                {activeTaskId   ? <div className="rotate-1 opacity-90 scale-105"><TaskCard id={activeTaskId} isDragOverlay /></div> : null}

                {activeColumnId ? <div className="opacity-80 scale-[1.02]"><Column columnId={activeColumnId} isDragOverlay /></div>  : null}
            </DragOverlay>
        </DndContext>
    );
}
