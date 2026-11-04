import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { getConsent, initAnalytics } from "./lib/analytics";

// Analytics only start after the visitor has accepted them.
if (getConsent() === "accepted") initAnalytics();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
