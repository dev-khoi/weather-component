import { createRootRouteWithContext, Outlet, Link } from "@tanstack/react-router";
import type { AuthContextType } from "@/auth/auth";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
interface MyRouterContext {
  auth: AuthContextType
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>
            <div>
                <Link to="/">
                </Link>
                <Link to="/weather" >
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
