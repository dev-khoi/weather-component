import { createFileRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    console.log(context.auth.isAuthenticated)
    if (!context.auth.isAuthenticated) {

      throw redirect({
        to: '/login',
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
  // Optionally, you can still use context here if needed
  return <Outlet />
}
