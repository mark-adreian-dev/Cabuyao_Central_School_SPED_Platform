import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthState from "./context/Auth/AuthState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthState>
      <App />
    </AuthState>
  </StrictMode>
);
