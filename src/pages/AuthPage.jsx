import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signUp, signInWithGoogle, clearError } from "../features/auth/authSlice";
import Logo from '../assets/logo.svg';

function validate(mode, { email, password, displayName }) {
    const errors = {};

    if (mode === "signup") {
        if (!displayName.trim()) {
            errors.displayName = "Name is required.";
        } else if (displayName.trim().length < 2) {
            errors.displayName = "Name must be at least 2 characters.";
        }
    }

    if (!email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
    }

    return errors;
}

export default function AuthPage() {
    const dispatch = useDispatch();
    const { status, error } = useSelector(state => state.auth);
    const loading = status === "loading";

    const [mode, setMode]               = useState("signin");
    const [email, setEmail]             = useState("");
    const [password, setPassword]       = useState("");
    const [displayName, setDisplayName] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched]         = useState({});

    function switchMode(m) {
        setMode(m);
        dispatch(clearError());
        setEmail(""); setPassword(""); setDisplayName("");
        setFieldErrors({});
        setTouched({});
    }

    function handleBlur(field) {
        setTouched(prev => ({ ...prev, [field]: true }));
        const errs = validate(mode, { email, password, displayName });
        setFieldErrors(errs);
    }

    function handleChange(field, value) {
        const setters = { email: setEmail, password: setPassword, displayName: setDisplayName };
        setters[field](value);

        // Re-validate touched fields live
        if (touched[field]) {
            const updated = { email, password, displayName, [field]: value };
            const errs = validate(mode, updated);
            setFieldErrors(prev => ({ ...prev, [field]: errs[field] }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = { email: true, password: true, displayName: true };
        setTouched(allTouched);

        const errs = validate(mode, { email, password, displayName });
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        if (mode === "signup") {
            dispatch(signUp({ email, password, displayName }));
        } else {
            dispatch(signIn({ email, password }));
        }
    }

    return (
        <div className="h-screen w-screen bg-slate-100 flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center">
                        <img src={Logo} alt="" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">Kanban</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-lg font-semibold text-slate-800 mb-1">
                        {mode === "signin" ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-sm text-slate-400 mb-6">
                        {mode === "signin"
                            ? "Sign in to access your board."
                            : "Sign up to get started."}
                    </p>

                    {/* Firebase error banner */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2.5 mb-4 border border-red-100">
                            {friendlyError(error)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

                        {mode === "signup" && (
                            <Field
                                label="Name"
                                error={touched.displayName && fieldErrors.displayName}
                            >
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

                        <Field
                            label="Email"
                            error={touched.email && fieldErrors.email}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={e => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                placeholder="you@example.com"
                                className={inputCx(touched.email && fieldErrors.email)}
                            />
                        </Field>

                        <Field
                            label="Password"
                            error={touched.password && fieldErrors.password}
                        >
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
                            className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-violet-500/20"
                        >
                            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={() => dispatch(signInWithGoogle())}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Switch mode */}
                    <p className="text-center text-xs text-slate-400 mt-5">
                        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                            className="text-violet-500 font-medium hover:underline"
                        >
                            {mode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
    return (
        <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
            {children}
            {error && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

function inputCx(hasError) {
    return [
        "w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-colors border",
        hasError
            ? "border-red-300 focus:border-red-400 bg-red-50"
            : "border-slate-200 focus:border-violet-400 bg-white",
    ].join(" ");
}

function friendlyError(msg) {
    if (msg.includes("email-already-in-use"))  return "An account with this email already exists.";
    if (msg.includes("user-not-found"))        return "No account found with this email.";
    if (msg.includes("wrong-password"))        return "Incorrect password. Please try again.";
    if (msg.includes("invalid-email"))         return "Please enter a valid email address.";
    if (msg.includes("weak-password"))         return "Password should be at least 6 characters.";
    if (msg.includes("popup-closed-by-user"))  return "Sign-in popup was closed. Please try again.";
    return "Something went wrong. Please try again.";
}
