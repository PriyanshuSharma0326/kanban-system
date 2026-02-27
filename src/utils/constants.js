const AVATAR_COLORS = [
    { value: "#8B5CF6", label: "Violet" },
    { value: "#38BDF8", label: "Sky" },
    { value: "#34D399", label: "Green" },
    { value: "#F472B6", label: "Pink" },
    { value: "#FBBF24", label: "Amber" },
    { value: "#F87171", label: "Red" },
    { value: "#818CF8", label: "Indigo" },
    { value: "#2DD4BF", label: "Teal" },
    { value: "#FB923C", label: "Orange" },
    { value: "#22D3EE", label: "Cyan" },
];

const PRIORITIES = ["Low", "Medium", "High"];

const priorityColors = {
    Low: "bg-emerald-100 text-emerald-600",
    Medium: "bg-amber-100 text-amber-600",
    High: "bg-red-100 text-red-600",
};

const labelColors = {
    Design: "bg-sky-100 text-sky-600",
    Development: "bg-emerald-100 text-emerald-600",
    Marketing: "bg-pink-100 text-pink-600",
    General: "bg-slate-100 text-slate-600",
};

const PRIORITY_COLORS = {
    Low: "bg-emerald-100 text-emerald-600 border-emerald-200",
    Medium: "bg-amber-100 text-amber-600 border-amber-200",
    High: "bg-red-100 text-red-600 border-red-200",
};

const LABELS = [
    { name: "Design", color: "bg-sky-100 text-sky-600"        },
    { name: "Development", color: "bg-emerald-100 text-emerald-600" },
    { name: "Marketing", color: "bg-pink-100 text-pink-600"       },
    { name: "General", color: "bg-slate-100 text-slate-600"     },
];

const BLANK = { 
    title: "", 
    description: "", 
    priority: "Low", 
    label: "General", 
    assignees: [], 
    dueDate: null 
};

const SEED_COLUMNS = [
    {
        title: "To Do",
        tasks: [
            { 
                title: "Set up project repository", 
                priority: "High", 
                label: "Engineering", 
                description: "Init repo, add README, configure CI." 
            },
            { 
                title: "Define color system", 
                priority: "Medium", 
                label: "Design",
                description: "Pick primary, neutral and semantic tokens." 
            },
            { 
                title: "Write project brief", 
                priority: "Low", 
                label: "General", 
                description: "Outline goals, stakeholders and timeline." 
            },
            { 
                title: "Audit competitor products", 
                priority: "Medium", 
                label: "Research", 
                description: "List top 5 competitors and note key features." 
            },
        ],
    },
    {
        title: "In Progress",
        tasks: [
            { 
                title: "Build authentication flow", 
                priority: "High", 
                label: "Engineering", 
                description: "Email/password + Google OAuth via Firebase." 
            },
            { 
                title: "Design onboarding screens", 
                priority: "High",   label: "Design", 
                description: "Figma frames for welcome, sign-up and empty state." 
            },
            { 
                title: "Integrate Firestore board", 
                priority: "Medium", label: "Engineering", 
                description: "Columns, tasks and members sub-collections." 
            },
        ],
    },
    {
        title: "Done",
        tasks: [
            { 
                title: "Kickoff meeting", 
                priority: "Low", 
                label: "General", 
                description: "Align team on scope and delivery dates." 
            },
            { 
                title: "Choose tech stack", 
                priority: "Medium", 
                label: "Engineering", 
                description: "Settled on React + Redux + Firebase + Tailwind." 
            },
            { 
                title: "Create Figma workspace", 
                priority: "Low", 
                label: "Design", 
                description: "Shared workspace created, team invited." 
            },
            { 
                title: "Register domain & Firebase", 
                priority: "Low", 
                label: "Engineering", 
                description: "Domain purchased, Firebase project initialised." 
            },
        ],
    },
];

export {
    AVATAR_COLORS,
    priorityColors,
    labelColors,
    PRIORITY_COLORS,
    LABELS,
    BLANK,
    PRIORITIES,
    SEED_COLUMNS,
}
