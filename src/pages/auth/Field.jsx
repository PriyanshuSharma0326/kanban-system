import { AlertCircle } from "lucide-react";

export default function Field({ label, error, children }) {
    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block tracking-wide uppercase">
                {label}
            </label>

            {children}

            {error && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" strokeWidth={2} />

                    {error}
                </p>
            )}
        </div>
    );
}
