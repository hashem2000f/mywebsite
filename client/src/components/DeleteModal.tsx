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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="deleteModalLabel">تأكيد الحذف</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="text-center mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="text-center mb-3">هل أنت متأكد من رغبتك في حذف هذا الموقع؟</h5>
            <div className="alert alert-secondary">
              <div className="d-flex align-items-center">
                {bookmark?.iconType && (
                  <span className={`bookmark-icon me-2 ${bookmark?.iconColor || 'bg-primary'}`}>
                    <i className={bookmark.iconType}></i>
                  </span>
                )}
                <strong>{bookmark?.name}</strong>
                {bookmark?.url && (
                  <small className="text-muted ms-2">({bookmark.url})</small>
                )}
              </div>
            </div>
            <p className="text-danger small mt-3 mb-0">
              <i className="fas fa-info-circle me-1"></i>
              هذا الإجراء لا يمكن التراجع عنه!
            </p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              <i className="fas fa-times me-1"></i>
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
                  <span className="ms-1">جاري الحذف...</span>
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
