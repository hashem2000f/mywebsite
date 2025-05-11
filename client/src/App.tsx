import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// Import Bootstrap JS with support for modals
import Modal from "bootstrap/js/dist/modal";

// Make Bootstrap Modal available globally
if (typeof window !== 'undefined') {
  window.bootstrap = {
    Modal: Modal
  };
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Flag to track if Bootstrap is loaded
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);
  
  // Initialize Bootstrap when component mounts
  useEffect(() => {
    // Make sure Bootstrap is available
    if (typeof window !== 'undefined' && window.bootstrap) {
      setBootstrapLoaded(true);
    } else {
      // Retry after a short delay if not loaded
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.bootstrap = {
            Modal: Modal
          };
          setBootstrapLoaded(true);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
