import { Bookmark } from "@shared/schema";

interface BookmarkTableProps {
  bookmarks: Bookmark[];
  onEditClick: (bookmark: Bookmark) => void;
  onDeleteClick: (bookmark: Bookmark) => void;
}

export default function BookmarkTable({ bookmarks, onEditClick, onDeleteClick }: BookmarkTableProps) {
  // Helper function to extract domain from URL for display
  const extractDomain = (url: string) => {
    try {
      // Remove protocol and get domain
      let domain = url.replace(/(https?:\/\/)?(www\.)?/i, '');
      // Remove path after domain
      if (domain.indexOf('/') !== -1) {
        domain = domain.split('/')[0];
      }
      return domain;
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="table-container">
      <table className="table table-striped table-hover mb-0">
        <thead className="table-dark sticky-top">
          <tr>
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "40%" }}>اسم الموقع</th>
            <th style={{ width: "35%" }}>رابط الموقع</th>
            <th style={{ width: "20%" }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody id="bookmarksList">
          {bookmarks.map((bookmark, index) => (
            <tr key={bookmark.id}>
              <td>{index + 1}</td>
              <td>
                <div className="d-flex align-items-center">
                  <span className={`bookmark-icon ${bookmark.iconColor}`}>
                    <i className={bookmark.iconType}></i>
                  </span>
                  <span>{bookmark.name}</span>
                </div>
              </td>
              <td>
                <a href={bookmark.url} target="_blank" className="text-primary text-decoration-none" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt me-1"></i>
                  {extractDomain(bookmark.url)}
                </a>
              </td>
              <td>
                <div className="action-btns">
                  <button 
                    className="btn btn-sm btn-outline-primary me-1" 
                    onClick={() => onEditClick(bookmark)}
                  >
                    <i className="fas fa-edit"></i> تعديل
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => onDeleteClick(bookmark)}
                  >
                    <i className="fas fa-trash-alt"></i> حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
