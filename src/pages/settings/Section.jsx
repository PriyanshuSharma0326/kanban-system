export default function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

            {description && <p className="text-xs text-slate-400 mt-0.5 mb-4">{description}</p>}

            {!description && <div className="mb-4" />}

            {children}
        </div>
    );
}
