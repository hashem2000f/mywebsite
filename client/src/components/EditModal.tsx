import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Bookmark, type UpdateBookmark } from "@shared/schema";

interface EditModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

// Icon options for the bookmark with colors
const iconOptions = [
  { icon: "fas fa-globe", color: "bg-primary", label: "عام" },
  { icon: "fab fa-youtube", color: "bg-danger", label: "يوتيوب" },
  { icon: "fab fa-github", color: "bg-dark", label: "جيت هاب" },
  { icon: "fas fa-server", color: "bg-info", label: "استضافة" },
  { icon: "fas fa-bookmark", color: "bg-success", label: "إشارة مرجعية" },
  { icon: "fas fa-file-pdf", color: "bg-danger", label: "ملف PDF" },
  { icon: "fas fa-envelope", color: "bg-success", label: "بريد إلكتروني" },
  { icon: "fas fa-brain", color: "bg-warning", label: "ذكاء اصطناعي" },
  { icon: "fas fa-microphone", color: "bg-warning", label: "تسجيل صوتي" },
  { icon: "fas fa-paper-plane", color: "bg-info", label: "بريد" },
  { icon: "fab fa-openai", color: "bg-secondary", label: "ذكاء اصطناعي" },
  { icon: "fab fa-instagram", color: "bg-danger", label: "انستغرام" },
  { icon: "fab fa-twitter", color: "bg-info", label: "تويتر" },
  { icon: "fas fa-code", color: "bg-dark", label: "برمجة" },
  { icon: "fas fa-cloud", color: "bg-info", label: "سحابة" },
];

export default function EditModal({ bookmark, onClose }: EditModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconType, setIconType] = useState("");
  const [iconColor, setIconColor] = useState("");
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
      setIconColor(bookmark.iconColor);
    }
  }, [bookmark]);

  // Update icon color when icon type changes
  const handleIconChange = (icon: string) => {
    setIconType(icon);
    // Find matching color for the icon
    const iconOption = iconOptions.find(option => option.icon === icon);
    if (iconOption) {
      setIconColor(iconOption.color);
    }
  };

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
      iconColor,
    });
  };

  return (
    <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="editModalLabel">
              <i className="fas fa-edit me-2"></i>
              تعديل الموقع
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <form id="editForm" className={validated ? 'was-validated' : ''} onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="editSiteName" className="form-label fw-bold">اسم الموقع</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="editSiteName" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  placeholder="أدخل اسم الموقع"
                />
                <div className="invalid-feedback">
                  يرجى إدخال اسم الموقع
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="editSiteUrl" className="form-label fw-bold">رابط الموقع</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-link"></i>
                  </span>
                  <input 
                    type="url" 
                    className="form-control" 
                    id="editSiteUrl" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required 
                    placeholder="https://example.com"
                    pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
                  />
                </div>
                <div className="invalid-feedback">
                  يرجى إدخال رابط صالح
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="editIconType" className="form-label fw-bold">أيقونة الموقع</label>
                <select 
                  className="form-select" 
                  id="editIconType"
                  value={iconType}
                  onChange={(e) => handleIconChange(e.target.value)}
                >
                  {iconOptions.map((option) => (
                    <option key={option.icon} value={option.icon}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">معاينة</label>
                <div className="p-3 border rounded">
                  <div className="d-flex align-items-center">
                    <span className={`bookmark-icon ${iconColor}`}>
                      <i className={iconType}></i>
                    </span>
                    <span className="ms-2 fw-bold">{name || 'اسم الموقع'}</span>
                  </div>
                  <div className="mt-2">
                    <a href="#" className="text-primary text-decoration-none">
                      <i className="fas fa-external-link-alt me-1"></i>
                      {url || 'https://example.com'}
                    </a>
                  </div>
                </div>
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
              <i className="fas fa-times me-1"></i>
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
                  <span className="ms-1">جاري الحفظ...</span>
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
