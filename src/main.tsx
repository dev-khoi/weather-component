import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import  {App}  from "./gridLayout.tsx"
import { navBar } from "./navbar.ts";
navBar();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
