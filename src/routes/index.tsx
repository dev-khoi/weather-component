import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "../libs/landingPage";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return <LandingPage />;
}
