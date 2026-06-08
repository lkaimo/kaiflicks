import { useState } from "react";
import S from "../styles/browseStyles";

// ─────────────────────────────────────────
// Movie Card (with hover effect)
// ─────────────────────────────────────────
export default function MovieCard({ movie, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.card,
        transform: hovered ? "scale(1.03)" : "scale(1)",
        cursor: "pointer",
      }}
    >
      <div style={S.posterWrapper}>
        <img
          src={movie.medium_cover_image}
          alt={movie.title}
          style={S.poster}
          onError={e => (e.target.style.display = "none")}
        />
        <div style={S.ratingBadge}>⭐ {movie.rating}</div>

        {/* Hover overlay */}
        <div style={{ ...S.hoverOverlay, opacity: hovered ? 1 : 0 }}>
          <div style={S.playIcon}>▶</div>
          <span style={{ fontSize: "12px", marginTop: "6px", color: "#fff" }}>
            View Details
          </span>
        </div>
      </div>

      <div style={S.cardBody}>
        <p style={S.movieTitle}>{movie.title}</p>
        <p style={S.movieMeta}>{movie.year}</p>
        {movie.genres && (
          <p style={S.genres}>{movie.genres.slice(0, 2).join(" · ")}</p>
        )}
      </div>
    </div>
  );
}
