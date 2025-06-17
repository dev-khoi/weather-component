import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./gridLayout.tsx";
import { NavBar } from "./navbar.tsx";
import { SearchBar } from "./searchBar.tsx";
// navBar function
// navBar();
// createRoot(document.getElementById("nav")!).render(<NavBar />);
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <main>
            <App />
        </main>
    </StrictMode>
);
