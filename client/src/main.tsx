import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthState from "./context/Auth/AuthState.tsx";
import { BrowserRouter } from "react-router-dom";
import SectionState from "./context/Sections/SectionState.tsx";
import ActivitiesState from "./context/Activities/ActivitiesState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthState>
        <SectionState>
          <ActivitiesState>
            <App />
          </ActivitiesState>
        </SectionState>
      </AuthState>
    </BrowserRouter>
  </StrictMode>
);
