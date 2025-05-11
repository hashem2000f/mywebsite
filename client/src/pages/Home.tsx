import { useEffect } from "react";
import BookmarkManager from "../components/BookmarkManager";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

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

  // Add a small toast to notify the user the app is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "دليل المواقع جاهز للاستخدام",
        description: "يمكنك الآن إضافة وتعديل وحذف المواقع المفضلة لديك",
        variant: "default",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="container py-4">
      <BookmarkManager />
    </div>
  );
}
