import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            <div>
                <Link to="/">
                </Link>
                <Link to="/weather" >
                </Link>
            </div>
            <Outlet />
            <TanStackRouterDevtools
                initialIsOpen
                position="bottom-right"
            />{" "}
            {/* 👈 this line must be present */}
        </>
    ),
});
