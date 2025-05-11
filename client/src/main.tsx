import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")!).render(<App />);
