import { useState } from "react";
import { addMember, deleteMember } from "../../features/board/boardSlice";
import { AVATAR_COLORS } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import Section from "./Section";
import Avatar from "./Avatar";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function MembersSection() {
    const dispatch = useDispatch();

    const uid = useSelector(state => state.auth.user?.uid);
    const members = useSelector(state => state.board.members);

    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState("");
    const [color, setColor] = useState(AVATAR_COLORS[0].value);
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleAdd() {
        if (!name.trim() || !uid) return;

        dispatch(addMember({ uid, name: name.trim(), avatarColor: color }));

        setName("");
        setColor(AVATAR_COLORS[0].value);
        setIsAdding(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleAdd();
        }
        if (e.key === "Escape") {
            setIsAdding(false);
            setName("");
        }
    }

    const memberList = Object.values(members);

    return (
        <>
            <Section
                title="Team Members"
                description="Members are private to your account and can be assigned to tasks."
            >
                {memberList.length === 0 && !isAdding && (
                    <p className="text-xs text-slate-400 mb-4">No members yet. Add people you work with.</p>
                )}

                <div className="flex flex-col gap-2 mb-3">
                    {memberList.map(member => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl group"
                        >
                            <Avatar color={member.avatarColor} name={member.name} size={8} />

                            <span className="flex-1 text-sm font-medium text-slate-700">{member.name}</span>

                            <button
                                onClick={() => setDeleteTarget(member)}
                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all text-xs px-1"
                                title="Remove member"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {isAdding ? (
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>

                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Alex, Sam..."
                                autoFocus
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-violet-400 transition-colors bg-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-2 block">Avatar Colour</label>

                            <div className="flex gap-2 flex-wrap">
                                {AVATAR_COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setColor(c.value)}
                                        title={c.label}
                                        style={{ backgroundColor: c.value }}
                                        className={`
                                            h-7 w-7 rounded-full flex-shrink-0 transition-transform
                                            ${color === c.value
                                                ? "ring-2 ring-offset-2 ring-violet-500 scale-110"
                                                : "hover:scale-105 opacity-70 hover:opacity-100"}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>

                        {name.trim() && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                                <Avatar color={color} name={name.trim()} size={7} />

                                <span className="text-sm text-slate-700 font-medium">{name.trim()}</span>

                                <span className="text-xs text-slate-400 ml-auto">Preview</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                disabled={!name.trim()}
                                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                                    name.trim()
                                        ? "bg-violet-500 text-white hover:bg-violet-600 shadow-sm shadow-violet-500/20"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                Add Member
                            </button>

                            <button
                                onClick={() => { setIsAdding(false); setName(""); setColor(AVATAR_COLORS[0].value); }}
                                className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-2.5 rounded-xl text-sm text-slate-500 border border-dashed border-slate-300 hover:border-violet-300 hover:text-violet-500 transition"
                    >
                        + Add Member
                    </button>
                )}
            </Section>

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Remove member?"
                message={deleteTarget ? `"${deleteTarget.name}" will be removed. They will be unassigned from all tasks.` : ""}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={() => {
                    if (uid && deleteTarget) dispatch(deleteMember({ uid, memberId: deleteTarget.id }));
                    setDeleteTarget(null);
                }}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}
