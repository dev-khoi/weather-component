import { createFileRoute } from "@tanstack/react-router";
import { App } from "../../Weather/getAndStoreWeather.tsx";
export const Route = createFileRoute("/_auth/weather")({
    component: RouteComponent,
});

function RouteComponent() {
    return <App />;
}
