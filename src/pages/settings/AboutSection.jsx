import Row from "./Row";
import Section from "./Section";

export default function AboutSection() {
    return (
        <Section title="About">
            <div className="flex flex-col gap-0 text-sm">
                <Row 
                    label="App"
                    value="Kanban Board"
                />

                <Row 
                    label="Version" 
                    value="1.0.0" 
                />

                <Row 
                    label="State" 
                    value="Redux Toolkit" 
                />

                <Row 
                    label="Database" 
                    value="Firebase Firestore" 
                />

                <Row 
                    label="Auth" 
                    value="Firebase Auth" 
                />

                <Row 
                    label="Drag & Drop" 
                    value="@dnd-kit/core" 
                />
            </div>
        </Section>
    );
}
