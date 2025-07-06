import { createFileRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_logged')({
    beforeLoad: async ({ context, location }) => {
        // Assume context.auth contains isAuthenticated
        if (context.auth?.isAuthenticated) {
            throw redirect({
                to: '/',
                search: {
                    redirect: location.href,
                },
                replace: true,
            })
        }
    },
    component: AuthLayout,
})

function AuthLayout() {
    // You can still use context if needed for rendering
    return <Outlet />
}
