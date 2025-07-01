import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthState from "./context/Auth/AuthState.tsx";
import { BrowserRouter } from "react-router-dom";
import SectionState from "./context/Sections/SectionState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthState>
        <SectionState>
          <App />
        </SectionState>
      </AuthState>
    </BrowserRouter>
  </StrictMode>
);
