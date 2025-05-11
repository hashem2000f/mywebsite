import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type InsertBookmark } from "@shared/schema";

// Icon options for the bookmark - same as in EditModal.tsx
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

export default function BookmarkForm() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [validated, setValidated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get a random icon and color for new bookmarks
  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * iconOptions.length);
    return iconOptions[randomIndex];
  };

  // Create bookmark mutation
  const { mutate: createBookmark, isPending } = useMutation({
    mutationFn: async (newBookmark: InsertBookmark) => {
      const response = await apiRequest("POST", "/api/bookmarks", newBookmark);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      
      // Reset form
      setSiteName("");
      setSiteUrl("");
      setValidated(false);
      
      // Show success toast
      toast({
        title: "تم بنجاح",
        description: "تمت إضافة الموقع بنجاح",
        variant: "default",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "خطأ",
        description: `فشل في إضافة الموقع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Get random icon and color
    const { icon, color } = getRandomIcon();
    
    // Create new bookmark
    createBookmark({
      name: siteName.trim(),
      url: siteUrl.trim(),
      iconType: icon,
      iconColor: color,
    });
  };

  return (
    <form 
      id="bookmarkForm" 
      className={`row g-3 mb-4 ${validated ? 'was-validated' : ''}`} 
      onSubmit={handleSubmit} 
      noValidate
    >
      <div className="col-md-5 col-sm-12">
        <label htmlFor="siteName" className="form-label fw-bold">اسم الموقع</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-tag"></i>
          </span>
          <input 
            type="text" 
            className="form-control" 
            id="siteName" 
            placeholder="أدخل اسم الموقع" 
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required 
          />
        </div>
        <div className="invalid-feedback">
          يرجى إدخال اسم الموقع
        </div>
      </div>
      <div className="col-md-5 col-sm-12">
        <label htmlFor="siteUrl" className="form-label fw-bold">رابط الموقع</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-link"></i>
          </span>
          <input 
            type="url" 
            className="form-control" 
            id="siteUrl" 
            placeholder="https://example.com" 
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            required 
            pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
          />
        </div>
        <div className="invalid-feedback">
          يرجى إدخال رابط صالح
        </div>
      </div>
      <div className="col-md-2 col-sm-12 d-flex align-items-end">
        <button 
          type="submit" 
          className="btn btn-success w-100 py-2" 
          id="submitBtn"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="ms-1">جاري...</span>
            </>
          ) : (
            <>
              <i className="fas fa-plus me-1"></i> إضافة
            </>
          )}
        </button>
      </div>
    </form>
  );
}
