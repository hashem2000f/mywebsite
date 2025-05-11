interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  // Different message if search term is present
  const isSearching = searchTerm.trim() !== "";

  return (
    <div id="emptyState" className="text-center my-5">
      {/* Bookmark illustration */}
      <div className="mb-3">
        <i className="fas fa-bookmark text-secondary" style={{ fontSize: "4rem" }}></i>
      </div>
      
      {isSearching ? (
        <>
          <h4 className="text-secondary">لا توجد نتائج مطابقة</h4>
          <p className="text-muted">لم نجد مواقع تطابق "{searchTerm}"</p>
          <button 
            className="btn btn-outline-primary mt-2"
            onClick={() => document.getElementById('searchInput')?.focus()}
          >
            <i className="fas fa-search me-1"></i> تعديل البحث
          </button>
        </>
      ) : (
        <>
          <h4 className="text-secondary">لا توجد مواقع محفوظة حتى الآن</h4>
          <p className="text-muted">أضف موقعك الأول باستخدام النموذج أعلاه</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => document.getElementById('siteName')?.focus()}
          >
            <i className="fas fa-plus me-1"></i> إضافة موقع جديد
          </button>
        </>
      )}
    </div>
  );
}
