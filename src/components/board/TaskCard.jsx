import { useSelector, useDispatch } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { openTaskPanel } from "../../features/board/boardSlice";
import { Pencil } from "lucide-react";
import { labelColors, priorityColors } from "../../utils/constants";

export default function TaskCard({ id, isDragOverlay = false }) {
    const dispatch = useDispatch();

    const { tasks, members } = useSelector(state => state.board);

    const task = tasks[id];

    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({ id, disabled: isDragOverlay, });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    if (!task) return null;

    return (
        <div
            ref={isDragOverlay ? undefined : setNodeRef}
            style={isDragOverlay ? {} : style}
            className={`
                group relative bg-white rounded-xl shadow-sm select-none
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
                ${isDragging ? "shadow-lg ring-2 ring-violet-300" : ""}
            `}
        >
            <div className="px-3 pt-2.5 pb-3">
                <div className="flex items-center gap-1.5">
                    <span
                        {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
                        className="flex-shrink-0 outline-none text-slate-300 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none select-none leading-none"
                        title="Drag to move"
                    >
                        ⠿
                    </span>

                    <h3 className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate">
                        {task.title}
                    </h3>

                    {!isDragOverlay && (
                        <button
                            onClick={() => dispatch(openTaskPanel(id))}
                            className="
                                flex-shrink-0 outline-none
                                opacity-0 group-hover:opacity-100
                                h-6 w-6 flex items-center justify-center
                                rounded-md bg-slate-100 hover:bg-violet-100
                                text-slate-400 hover:text-violet-500
                                transition-all duration-150
                            "
                            title="Edit task"
                        >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                    )}
                </div>

                {task.description && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {task.description}
                    </p>
                )}

                <div className="flex gap-1.5 mt-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium select-none ${labelColors[task.label] ?? "bg-slate-100 text-slate-600"}`}>
                        {task.label}
                    </span>

                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium select-none ${priorityColors[task.priority] ?? "bg-slate-100 text-slate-600"}`}>
                        {task.priority}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex -space-x-2">
                        {task.assignees && task.assignees.length > 0 ? (
                            task.assignees.map(userId => {
                                const member = members?.[userId];

                                if (!member) return null;

                                const initials = member.name
                                    ? member.name
                                        .split(" ")
                                        .map(w => w[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)
                                    : "U";

                                const isHex = member.avatarColor?.startsWith("#");

                                return (
                                    <div
                                        key={userId}
                                        className="h-6 w-6 flex items-center justify-center rounded-full border-2 border-white flex-shrink-0 cursor-pointer"
                                        style={isHex ? { backgroundColor: member.avatarColor } : {}}
                                        title={member.name || "User"}
                                    >
                                        <p className="text-[8px] leading-[8px] font-medium text-white">
                                            {initials}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <button
                                type="button"
                                className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs bg-white hover:bg-slate-50 transition"
                                onClick={() => console.log("Add assignee")}
                            >
                                +
                            </button>
                        )}
                    </div>

                    <span
                        className={`text-[10px] px-2 py-1 rounded-full font-medium select-none ${
                            task.dueDate
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-400"
                        }`}
                    >
                        {task.dueDate
                            ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                            : "No Date"}
                    </span>
                </div>
            </div>
        </div>
    );
}
