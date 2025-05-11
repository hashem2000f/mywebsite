import { useEffect } from "react";
import BookmarkManager from "../components/BookmarkManager";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
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

    return () => {
      modals.forEach(modalElement => {
        modalElement.removeEventListener('hidden.bs.modal', () => {});
      });
    };
  }, []);

  return (
    <div className="container py-4">
      <BookmarkManager />
    </div>
  );
}
