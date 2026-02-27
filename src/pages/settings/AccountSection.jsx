import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/auth/authSlice";
import Section from "./Section";

export default function AccountSection() {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);

    const initials = user?.displayName
        ? user.displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "?";

    return (
        <Section title="Account" description="Your signed-in account.">
            <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName ?? "—"}</p>

                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
            </div>

            <button
                onClick={() => dispatch(logOut())}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition"
            >
                Sign Out
            </button>
        </Section>
    );
}
