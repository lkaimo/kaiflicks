import { getPageNumbers } from "../utils/helpers";
import S from "../styles/browseStyles";

// ─────────────────────────────────────────
// Pagination Component
// ─────────────────────────────────────────
export default function Pagination({ page, totalPages, onPageChange }) {
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div style={S.pagination}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...S.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
      >
        ← Prev
      </button>

      {pageNumbers.map((num, i) =>
        num === "..." ? (
          <span key={`e-${i}`} style={S.ellipsis}>…</span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            style={{
              ...S.pageBtn,
              backgroundColor: page === num ? "#e50914" : "transparent",
              borderColor:     page === num ? "#e50914" : "#444",
              fontWeight:      page === num ? "bold" : "normal",
            }}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...S.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
      >
        Next →
      </button>
    </div>
  );
}
