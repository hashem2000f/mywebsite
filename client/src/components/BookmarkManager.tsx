import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BookmarkForm from "./BookmarkForm";
import BookmarkTable from "./BookmarkTable";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import EmptyState from "./EmptyState";
import { Bookmark } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function BookmarkManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bookmarks from the API
  const { data: bookmarks = [], isLoading, error } = useQuery<Bookmark[]>({
    queryKey: ['/api/bookmarks'],
  });

  // Effect to initialize Bootstrap modals
  useEffect(() => {
    // Initialize modals when component mounts
    const initModals = () => {
      try {
        const editModalEl = document.getElementById('editModal');
        const deleteModalEl = document.getElementById('deleteModal');
        
        if (editModalEl && window.bootstrap) {
          new window.bootstrap.Modal(editModalEl);
        }
        if (deleteModalEl && window.bootstrap) {
          new window.bootstrap.Modal(deleteModalEl);
        }
      } catch (err) {
        console.error('Error initializing Bootstrap modals:', err);
      }
    };
    
    // Wait for bootstrap to be available
    const checkBootstrap = setInterval(() => {
      if (window.bootstrap) {
        initModals();
        clearInterval(checkBootstrap);
      }
    }, 100);
    
    return () => {
      clearInterval(checkBootstrap);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark => 
    searchTerm === "" || 
    bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit button click
  const handleEditClick = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowEditModal(true);
    // Use Bootstrap modal API to show the modal
    try {
      const editModalEl = document.getElementById('editModal');
      if (editModalEl && window.bootstrap) {
        const modal = new window.bootstrap.Modal(editModalEl);
        modal.show();
      } else {
        console.warn('Bootstrap or modal element not available');
      }
    } catch (err) {
      console.error('Could not show edit modal:', err);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark);
    setShowDeleteModal(true);
    // Use Bootstrap modal API to show the modal
    try {
      const deleteModalEl = document.getElementById('deleteModal');
      if (deleteModalEl && window.bootstrap) {
        const modal = new window.bootstrap.Modal(deleteModalEl);
        modal.show();
      } else {
        console.warn('Bootstrap or modal element not available');
      }
    } catch (err) {
      console.error('Could not show delete modal:', err);
    }
  };

  // Clear editing/deleting state after modal is closed
  const clearEditingState = () => {
    setEditingBookmark(null);
    setShowEditModal(false);
  };

  const clearDeletingState = () => {
    setDeletingBookmark(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white py-3">
            <h2 className="text-center mb-0 fs-4">
              <i className="fas fa-bookmark me-2"></i> دليل المواقع
            </h2>
          </div>
          <div className="card-body">
            <BookmarkForm />

            {/* Search and Filter Section */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text" id="search-addon">
                    <i className="fas fa-search"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="ابحث عن موقع..." 
                    id="searchInput" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-describedby="search-addon" 
                  />
                </div>
              </div>
              <div className="col-md-4 ms-auto text-end">
                <span className="badge bg-primary fs-6 bookmark-count">
                  <i className="fas fa-link me-1"></i> 
                  <span id="bookmarkCount">{bookmarks.length}</span> موقع
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">جاري التحميل...</span>
                </div>
                <p className="mt-2">جاري تحميل المواقع...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle me-2"></i>
                حدث خطأ أثناء تحميل المواقع. يرجى المحاولة مرة أخرى.
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState searchTerm={searchTerm} />
            ) : (
              <BookmarkTable 
                bookmarks={filteredBookmarks} 
                onEditClick={handleEditClick} 
                onDeleteClick={handleDeleteClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal 
        bookmark={editingBookmark} 
        onClose={clearEditingState} 
      />
      
      <DeleteModal 
        bookmark={deletingBookmark} 
        onClose={clearDeletingState} 
      />
    </div>
  );
}
