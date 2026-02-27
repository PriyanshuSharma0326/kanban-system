export default function Highlight({ text, query }) {
    if (!query.trim()) return text;

    const idx = text.toLowerCase().indexOf(query.toLowerCase());

    if (idx === -1) return text;

    return (
        <>
            {text.slice(0, idx)}

            <mark className="bg-violet-100 text-violet-700 rounded px-0.5">
                {text.slice(idx, idx + query.length)}
            </mark>

            {text.slice(idx + query.length)}
        </>
    );
}
