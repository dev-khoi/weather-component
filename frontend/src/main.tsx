import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuth } from "./auth/auth";
import { AuthProvider } from "./auth/auth";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { LoadingAnimation } from "./components/loading";

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
function InnerApp() {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
    const auth = useAuth();
    if(auth.isLoading){
      return(
        <LoadingAnimation />
      )
    }
    return (
        
            <InnerApp />
    );
}
// Render the app
const rootElement = document.getElementById("root")!;

const root = ReactDOM.createRoot(rootElement);
root.render(
    <StrictMode>
      <AuthProvider>
        <App />


      </AuthProvider>
    </StrictMode>,
);
