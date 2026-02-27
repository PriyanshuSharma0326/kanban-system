export default function inputCx(hasError) {
    return [
        "w-full px-4 py-3 text-sm rounded-xl outline-none transition-all border bg-white",
        hasError
            ? "border-red-300 focus:border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
    ].join(" ");
}
