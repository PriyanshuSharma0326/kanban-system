export default function Avatar({ color, name, size = 8 }) {
    const initial = name?.slice(0, 1).toUpperCase() ?? "?";
    const isHex = color?.startsWith("#");

    if (isHex) {
        return (
            <div
                style={{ backgroundColor: color, width: size * 4, height: size * 4, minWidth: size * 4 }}
                className="rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
                {initial}
            </div>
        );
    }

    return (
        <div className={`h-${size} w-${size} rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {initial}
        </div>
    );
}
