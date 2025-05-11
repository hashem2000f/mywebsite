import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Define a way to use Bootstrap Modal in our components
import Modal from "bootstrap/js/dist/modal";

// Add Bootstrap to the window object
declare global {
  interface Window {
    bootstrap: {
      Modal: typeof Modal;
    };
  }
}

// Wait for DOM to be ready before setting window.bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.bootstrap = {
    Modal: Modal
  };
});

createRoot(document.getElementById("root")!).render(<App />);
