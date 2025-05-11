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
    <div className="table-responsive table-container">
      <table className="table table-striped table-hover mb-0">
        <thead className="table-dark sticky-top">
          <tr>
            <th className="index-col">#</th>
            <th className="name-col">اسم الموقع</th>
            <th className="url-col">رابط الموقع</th>
            <th className="actions-col">الإجراءات</th>
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
                  <span className="ms-2 bookmark-name">{bookmark.name}</span>
                </div>
              </td>
              <td>
                <a href={bookmark.url} target="_blank" className="text-primary text-decoration-none url-link" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt me-1"></i>
                  <span className="url-text">{extractDomain(bookmark.url)}</span>
                </a>
              </td>
              <td>
                <div className="action-btns">
                  <button 
                    className="btn btn-sm btn-outline-primary me-1" 
                    onClick={() => onEditClick(bookmark)}
                    aria-label="تعديل"
                    title="تعديل بيانات الموقع"
                  >
                    <i className="fas fa-edit"></i> <span className="action-text">تعديل</span>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => onDeleteClick(bookmark)}
                    aria-label="حذف"
                    title="حذف الموقع"
                  >
                    <i className="fas fa-trash-alt"></i> <span className="action-text">حذف</span>
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
