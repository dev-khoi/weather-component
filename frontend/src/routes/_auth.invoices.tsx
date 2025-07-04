import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Link, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_auth/invoices')({
  loader: async () => ({
    invoices: "123",
  }),
  component: InvoicesRoute,
})

function InvoicesRoute() {
  const { invoices } = Route.useLoaderData()

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 min-h-[500px]">
      <div className="col-span-1 py-2 pl-2 pr-4 md:border-r">
        <p className="mb-2">Choose an invoice from the list below.</p>
        
      </div>
      <div className="col-span-2 md:col-span-4 py-2 px-4">
        <Outlet />
      </div>
    </div>
  )
}
