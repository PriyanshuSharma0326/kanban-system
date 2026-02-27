import AccountSection from "./AccountSection";
import MembersSection from "./MembersSection";
import AboutSection from "./AboutSection";

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto py-2">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Settings</h2>

            <div className="flex flex-col gap-6">
                <AccountSection />

                <MembersSection />

                <AboutSection />
            </div>
        </div>
    );
}
