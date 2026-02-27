import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../features/auth/authSlice";
import { addMember, deleteMember } from "../features/board/boardSlice";
import ConfirmModal from "../components/common/ConfirmModal";

const AVATAR_COLORS = [
    { value: "#8B5CF6", label: "Violet"  },
    { value: "#38BDF8", label: "Sky"     },
    { value: "#34D399", label: "Green"   },
    { value: "#F472B6", label: "Pink"    },
    { value: "#FBBF24", label: "Amber"   },
    { value: "#F87171", label: "Red"     },
    { value: "#818CF8", label: "Indigo"  },
    { value: "#2DD4BF", label: "Teal"    },
    { value: "#FB923C", label: "Orange"  },
    { value: "#22D3EE", label: "Cyan"    },
];

// Renders a circular avatar that works with BOTH hex colors and legacy Tailwind bg- classes
function Avatar({ color, name, size = 8 }) {
    const initial = name?.slice(0, 1).toUpperCase() ?? "?";
    const isHex   = color?.startsWith("#");

    if (isHex) {
        return (
            <div
                style={{ backgroundColor: color, width: size * 4, height: size * 4, minWidth: size * 4 }}
                className="rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
                {initial}
            </div>
        );
    }

    // Fallback for legacy Tailwind class strings
    return (
        <div className={`h-${size} w-${size} rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {initial}
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto py-2">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Settings</h2>
            <div className="flex flex-col gap-6">
                <AccountSection />
                <MembersSection />
                <AboutSection />
            </div>
        </div>
    );
}

// ── Account ───────────────────────────────────────────────────────────────────

function AccountSection() {
    const dispatch = useDispatch();
    const user     = useSelector(state => state.auth.user);

    const initials = user?.displayName
        ? user.displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "?";

    return (
        <Section title="Account" description="Your signed-in account.">
            <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName ?? "—"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
            </div>
            <button
                onClick={() => dispatch(logOut())}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition"
            >
                Sign Out
            </button>
        </Section>
    );
}

// ── Members ───────────────────────────────────────────────────────────────────

function MembersSection() {
    const dispatch = useDispatch();
    const uid      = useSelector(state => state.auth.user?.uid);
    const members  = useSelector(state => state.board.members);

    const [isAdding, setIsAdding]         = useState(false);
    const [name, setName]                 = useState("");
    const [color, setColor]               = useState(AVATAR_COLORS[0].value);
    const [deleteTarget, setDeleteTarget] = useState(null);

    function handleAdd() {
        if (!name.trim() || !uid) return;
        dispatch(addMember({ uid, name: name.trim(), avatarColor: color }));
        setName("");
        setColor(AVATAR_COLORS[0].value);
        setIsAdding(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAdd();
        if (e.key === "Escape") { setIsAdding(false); setName(""); }
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

// ── About ─────────────────────────────────────────────────────────────────────

function AboutSection() {
    return (
        <Section title="About">
            <div className="flex flex-col gap-0 text-sm">
                <Row label="App"         value="Kanban Board"      />
                <Row label="Version"     value="1.0.0"             />
                <Row label="State"       value="Redux Toolkit"     />
                <Row label="Database"    value="Firebase Firestore" />
                <Row label="Auth"        value="Firebase Auth"     />
                <Row label="Drag & Drop" value="@dnd-kit/core"     />
            </div>
        </Section>
    );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {description && <p className="text-xs text-slate-400 mt-0.5 mb-4">{description}</p>}
            {!description && <div className="mb-4" />}
            {children}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-slate-400 text-sm">{label}</span>
            <span className="font-medium text-slate-700 text-sm">{value}</span>
        </div>
    );
}
