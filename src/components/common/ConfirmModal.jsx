import { useEffect, useRef } from "react";

/**
 * ConfirmModal
 *
 * Props:
 *   isOpen      boolean
 *   title       string
 *   message     string
 *   confirmLabel  string  (default "Delete")
 *   cancelLabel   string  (default "Cancel")
 *   variant     "danger" | "default"
 *   onConfirm   () => void
 *   onCancel    () => void
 */
export default function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onCancel,
}) {
    const confirmRef = useRef(null);

    // Focus confirm button when opened
    useEffect(() => {
        if (isOpen) confirmRef.current?.focus();
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) {
            if (e.key === "Escape") onCancel();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onCancel}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-[360px] p-6 animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                    variant === "danger" ? "bg-red-50" : "bg-slate-100"
                }`}>
                    {variant === "danger" ? (
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
                {message && (
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                            variant === "danger"
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20"
                                : "bg-violet-500 text-white hover:bg-violet-600 shadow-md shadow-violet-500/20"
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
