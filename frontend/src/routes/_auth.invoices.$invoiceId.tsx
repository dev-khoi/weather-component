import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'


export const Route = createFileRoute('/_auth/invoices/$invoiceId')({
  loader: async ({ params: { invoiceId } }) => {
    return {
      invoice: "123",
    }
  },
  component: InvoicePage,
})

function InvoicePage() {
  const { invoice } = Route.useLoaderData()

  return (
    <section className="grid gap-2">
     
    </section>
  )
}
