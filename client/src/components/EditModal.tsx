import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Bookmark, type UpdateBookmark } from "@shared/schema";

interface EditModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

export default function EditModal({ bookmark, onClose }: EditModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconType, setIconType] = useState("");
  const [validated, setValidated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update bookmark mutation
  const { mutate: updateBookmark, isPending } = useMutation({
    mutationFn: async (updatedBookmark: UpdateBookmark) => {
      if (!bookmark) throw new Error("No bookmark to update");
      const response = await apiRequest("PUT", `/api/bookmarks/${bookmark.id}`, updatedBookmark);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      
      // Close modal
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
      
      // Reset form
      setValidated(false);
      
      // Show success toast
      toast({
        title: "تم بنجاح",
        description: "تم تحديث الموقع بنجاح",
        variant: "default",
      });
      
      // Call onClose callback
      onClose();
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "خطأ",
        description: `فشل في تحديث الموقع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    },
  });

  // Update form values when bookmark changes
  useEffect(() => {
    if (bookmark) {
      setName(bookmark.name);
      setUrl(bookmark.url);
      setIconType(bookmark.iconType);
    }
  }, [bookmark]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Update bookmark
    updateBookmark({
      name: name.trim(),
      url: url.trim(),
      iconType,
      iconColor: bookmark?.iconColor,
    });
  };

  return (
    <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="editModalLabel">تعديل الموقع</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="editForm" className={validated ? 'was-validated' : ''} onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="editSiteName" className="form-label">اسم الموقع</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="editSiteName" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
                <div className="invalid-feedback">
                  يرجى إدخال اسم الموقع
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="editSiteUrl" className="form-label">رابط الموقع</label>
                <input 
                  type="url" 
                  className="form-control" 
                  id="editSiteUrl" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required 
                  pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
                />
                <div className="invalid-feedback">
                  يرجى إدخال رابط صالح
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="editIconType" className="form-label">أيقونة الموقع</label>
                <select 
                  className="form-select" 
                  id="editIconType"
                  value={iconType}
                  onChange={(e) => setIconType(e.target.value)}
                >
                  <option value="fas fa-globe">عام</option>
                  <option value="fab fa-youtube">يوتيوب</option>
                  <option value="fab fa-github">جيت هاب</option>
                  <option value="fas fa-server">استضافة</option>
                  <option value="fas fa-bookmark">إشارة مرجعية</option>
                  <option value="fas fa-file-pdf">ملف PDF</option>
                  <option value="fas fa-envelope">بريد إلكتروني</option>
                  <option value="fas fa-brain">ذكاء اصطناعي</option>
                  <option value="fas fa-microphone">تسجيل صوتي</option>
                  <option value="fas fa-paper-plane">بريد</option>
                  <option value="fab fa-openai">ذكاء اصطناعي</option>
                  <option value="fab fa-instagram">انستغرام</option>
                </select>
              </div>
            </form>
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
              className="btn btn-primary" 
              onClick={() => document.getElementById('editForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="ms-1">جاري...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1"></i> حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
