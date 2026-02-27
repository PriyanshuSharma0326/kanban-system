export default function Row({ label, value }) {
    return (
        <div className="flex justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-slate-400 text-sm">{label}</span>

            <span className="font-medium text-slate-700 text-sm">{value}</span>
        </div>
    );
}