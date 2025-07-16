import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "../Weather/landingPage.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return <LandingPage />;
}
