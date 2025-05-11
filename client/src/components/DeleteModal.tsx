import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Bookmark } from "@shared/schema";

interface DeleteModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

export default function DeleteModal({ bookmark, onClose }: DeleteModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete bookmark mutation
  const { mutate: deleteBookmark, isPending } = useMutation({
    mutationFn: async () => {
      if (!bookmark) throw new Error("No bookmark to delete");
      const response = await apiRequest("DELETE", `/api/bookmarks/${bookmark.id}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      
      // Close modal
      const modalElement = document.getElementById('deleteModal');
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
      
      // Show success toast
      toast({
        title: "تم بنجاح",
        description: "تم حذف الموقع بنجاح",
        variant: "default",
      });
      
      // Call onClose callback
      onClose();
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "خطأ",
        description: `فشل في حذف الموقع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="deleteModalLabel">تأكيد الحذف</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>هل أنت متأكد من رغبتك في حذف هذا الموقع؟</p>
            <p>الموقع: <strong>{bookmark?.name}</strong></p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => deleteBookmark()}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="ms-1">جاري...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt me-1"></i> تأكيد الحذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
