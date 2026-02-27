import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signUp, signInWithGoogle, clearError } from "../../features/auth/authSlice";
import Logo from '../../assets/Logo.svg';
import GoogleIcon from '../../assets/Google.svg';
import { AlertCircle } from "lucide-react";
import { friendlyError, validate } from "../../utils/util";
import inputCx from "./InputCx";
import Field from "./Field";

export default function AuthPage() {
    const dispatch = useDispatch();

    const { status, error } = useSelector(state => state.auth);

    const loading = status === "loading";

    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    function switchMode(m) {
        setMode(m);
        dispatch(clearError());
        setEmail("");
        setPassword("");
        setDisplayName("");
        setFieldErrors({});
        setTouched({});
    }

    function handleBlur(field) {
        setTouched(prev => ({ ...prev, [field]: true }));
        setFieldErrors(validate(mode, { email, password, displayName }));
    }

    function handleChange(field, value) {
        ({ email: setEmail, password: setPassword, displayName: setDisplayName })[field](value);

        if (touched[field]) {
            const updated = { email, password, displayName, [field]: value };
            const errs = validate(mode, updated);

            setFieldErrors(prev => ({ ...prev, [field]: errs[field] }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        setTouched({ email: true, password: true, displayName: true });

        const errs = validate(mode, { email, password, displayName });
        setFieldErrors(errs);

        if (Object.keys(errs).length > 0) return;

        if (mode === "signup") {
            dispatch(signUp({ email, password, displayName }));
        }
        else {
            dispatch(signIn({ email, password }));
        }
    }

    return (
        <div className="min-h-screen w-screen bg-slate-50 flex select-none">
            <div className="hidden lg:flex w-[45%] xl:w-[42%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
                <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full bg-violet-600 opacity-20 blur-[100px]" />

                <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-violet-400 opacity-15 blur-[80px]" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <img src={Logo} alt="" />
                    </div>

                    <span className="text-white font-semibold text-lg tracking-tight">Kanban</span>
                </div>

                <div className="relative z-10">
                    <h2 className="text-white text-4xl font-bold leading-tight tracking-tight mb-4"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        Organise work.
                        <br />
                        <span className="text-violet-400">Ship faster.</span>
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        A personal kanban board that keeps your tasks, team, and priorities in one clean space.
                    </p>

                    <div className="flex flex-col gap-3 mt-8">
                        {[
                            { icon: "⚡", text: "Drag-and-drop task management" },
                            { icon: "👥", text: "Assign tasks to team members"  },
                            { icon: "📊", text: "Dashboard with live insights"  },
                        ].map(f => (
                            <div key={f.text} className="flex items-center gap-3">
                                <span className="text-base">{f.icon}</span>
                                <span className="text-slate-400 text-sm">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-slate-600 text-xs">
                    Built with React · Redux · Firebase
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-20 overflow-y-auto">
                <div className="lg:hidden flex items-center gap-2.5 mb-10">
                    <div className="h-9 w-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-md shadow-violet-500/25">
                        <img src={Logo} alt="" />
                    </div>

                    <span className="text-slate-800 font-bold text-lg">Kanban</span>
                </div>

                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1.5"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {mode === "signin" ? "Welcome back" : "Create account"}
                        </h1>

                        <p className="text-sm text-slate-400">
                            {mode === "signin"
                                ? "Sign in to continue to your board."
                                : "Sign up and get your board ready in seconds."}
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2.5 bg-red-50 text-red-600 text-xs rounded-xl px-3.5 py-3 mb-5 border border-red-100">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-500" strokeWidth={2} />

                            {friendlyError(error)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                        {mode === "signup" && (
                            <Field label="Full name" error={touched.displayName && fieldErrors.displayName}>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={e => handleChange("displayName", e.target.value)}
                                    onBlur={() => handleBlur("displayName")}
                                    placeholder="Your name"
                                    className={inputCx(touched.displayName && fieldErrors.displayName)}
                                />
                            </Field>
                        )}

                        <Field label="Email" error={touched.email && fieldErrors.email}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                placeholder="you@example.com"
                                className={inputCx(touched.email && fieldErrors.email)}
                            />
                        </Field>

                        <Field label="Password" error={touched.password && fieldErrors.password}>
                            <input
                                type="password"
                                value={password}
                                onChange={e => handleChange("password", e.target.value)}
                                onBlur={() => handleBlur("password")}
                                placeholder="••••••••"
                                className={inputCx(touched.password && fieldErrors.password)}
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-3 rounded-xl text-sm font-semibold bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/25 active:scale-[0.98]"
                        >
                            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-200" />

                        <span className="text-xs text-slate-400 font-medium">or</span>

                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <button
                        onClick={() => dispatch(signInWithGoogle())}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <img src={GoogleIcon} alt="" />
                        Continue with Google
                    </button>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}

                        <button
                            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                            className="text-violet-500 font-semibold hover:text-violet-600 transition"
                        >
                            {mode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
