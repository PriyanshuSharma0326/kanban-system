import { useSelector } from "react-redux";

// Works with both hex colors (#8B5CF6) and legacy Tailwind bg- class strings
function Avatar({ color, name, size = 6 }) {
    const initial = name?.slice(0, 1).toUpperCase() ?? "?";
    const px      = size * 4;

    if (color?.startsWith("#")) {
        return (
            <div
                style={{ backgroundColor: color, width: px, height: px, minWidth: px }}
                className="rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
                {initial}
            </div>
        );
    }

    return (
        <div className={`h-${size} w-${size} rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {initial}
        </div>
    );
}

export default function Dashboard() {
    const { columns, tasks, members: users, columnOrder } = useSelector(state => state.board);

    const allTasks = Object.values(tasks);
    const total    = allTasks.length;

    const byPriority = { High: 0, Medium: 0, Low: 0 };
    allTasks.forEach(t => { byPriority[t.priority] = (byPriority[t.priority] ?? 0) + 1; });

    const byLabel = {};
    allTasks.forEach(t => { byLabel[t.label] = (byLabel[t.label] ?? 0) + 1; });

    const withDueDate  = allTasks.filter(t => t.dueDate).length;

    const columnStats  = columnOrder.map(id => ({
        title: columns[id].title,
        count: columns[id].tasks.length,
    }));

    const labelColors = {
        Design:      "bg-sky-100 text-sky-600",
        Engineering: "bg-emerald-100 text-emerald-600",
        Marketing:   "bg-pink-100 text-pink-600",
        General:     "bg-slate-100 text-slate-600",
        Research:    "bg-violet-100 text-violet-600",
    };

    const priorityColors = {
        High:   "bg-red-100 text-red-600",
        Medium: "bg-amber-100 text-amber-600",
        Low:    "bg-emerald-100 text-emerald-600",
    };

    return (
        // ↓ Remove fixed height so the page can scroll naturally
        <div className="max-w-4xl mx-auto py-2 pb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Dashboard</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
                <StatCard label="Total Tasks"   value={total}               color="bg-violet-500" />
                <StatCard label="High Priority" value={byPriority.High}     color="bg-red-500"    />
                <StatCard label="With Due Date" value={withDueDate}          color="bg-amber-500"  />
                <StatCard label="Columns"       value={columnOrder.length}  color="bg-sky-500"    />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Tasks per column */}
                <Section title="Tasks per Column">
                    {columnStats.length === 0
                        ? <Empty />
                        : columnStats.map(col => (
                            <BarRow
                                key={col.title}
                                label={col.title}
                                value={col.count}
                                max={Math.max(...columnStats.map(c => c.count), 1)}
                                barColor="bg-violet-400"
                            />
                        ))
                    }
                </Section>

                {/* Tasks by priority */}
                <Section title="Tasks by Priority">
                    {Object.entries(byPriority).map(([p, count]) => (
                        <div key={p} className="flex items-center justify-between py-1.5">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[p]}`}>{p}</span>
                            <span className="text-sm font-semibold text-slate-700">{count}</span>
                        </div>
                    ))}
                </Section>

                {/* Tasks by label */}
                <Section title="Tasks by Label">
                    {Object.entries(byLabel).length === 0
                        ? <Empty />
                        : Object.entries(byLabel).map(([label, count]) => (
                            <div key={label} className="flex items-center justify-between py-1.5">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${labelColors[label] ?? "bg-slate-100 text-slate-600"}`}>{label}</span>
                                <span className="text-sm font-semibold text-slate-700">{count}</span>
                            </div>
                        ))
                    }
                </Section>

                {/* Assignee workload */}
                <Section title="Assignee Workload">
                    {Object.values(users).length === 0
                        ? <Empty />
                        : Object.values(users).map(user => {
                            const count = allTasks.filter(t => t.assignees?.includes(user.id)).length;
                            return (
                                <div key={user.id} className="flex items-center gap-3 py-1.5">
                                    <Avatar color={user.avatarColor} name={user.name} size={6} />
                                    <span className="text-sm text-slate-700 flex-1">{user.name}</span>
                                    <span className="text-sm font-semibold text-slate-700">{count} task{count !== 1 ? "s" : ""}</span>
                                </div>
                            );
                        })
                    }
                </Section>

            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className={`h-2 w-8 rounded-full ${color} mb-3`} />
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
            {children}
        </div>
    );
}

function BarRow({ label, value, max, barColor }) {
    const pct = max === 0 ? 0 : Math.round((value / max) * 100);
    return (
        <div className="py-1.5">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{label}</span>
                <span className="font-semibold">{value}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function Empty() {
    return <p className="text-xs text-slate-400 py-2">No data yet.</p>;
}
