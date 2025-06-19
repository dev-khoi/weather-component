import { createFileRoute } from '@tanstack/react-router'
import { App } from './../../libs/gridLayout.tsx'
export const Route = createFileRoute('/weather/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <App/> 
}
