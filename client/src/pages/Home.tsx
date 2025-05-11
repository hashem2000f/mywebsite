import { useEffect } from "react";
import BookmarkManager from "../components/BookmarkManager";

export default function Home() {
  useEffect(() => {
    // Initialize Bootstrap manually to handle modal events
    const setupModals = () => {
      // Check if the window object and bootstrap are available
      if (typeof window !== 'undefined') {
        // Listen for Bootstrap modal events to handle React state properly
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modalElement => {
          modalElement.addEventListener('hidden.bs.modal', () => {
            // This ensures the modal state is reset properly when closed via bootstrap controls
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          });
        });
      }
    };

    // Setup modals when the component mounts
    setupModals();

    // Clean up event listeners when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modalElement => {
          modalElement.removeEventListener('hidden.bs.modal', () => {});
        });
      }
    };
  }, []);

  return (
    <div className="container py-4">
      <BookmarkManager />
    </div>
  );
}
