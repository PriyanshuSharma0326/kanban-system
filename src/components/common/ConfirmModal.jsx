import { useEffect, useRef } from "react";
import Trash from '../../assets/Trash.svg';

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

    useEffect(() => {
        if (isOpen) confirmRef.current?.focus();
    }, [isOpen]);

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
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            <div
                className="relative bg-white rounded-2xl shadow-2xl w-[360px] p-6 animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <img src={Trash} alt="" className="w-5 h-5" style={{ filter: "invert(29%) sepia(99%) saturate(7472%) hue-rotate(356deg) brightness(94%) contrast(92%)" }} />
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
