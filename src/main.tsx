import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import  App  from "./mainApp.tsx"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <DragAndDrop /> */}

    <App />
  </StrictMode>
);
