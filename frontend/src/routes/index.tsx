import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "./../lib/landingPage.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return <LandingPage />;
}
