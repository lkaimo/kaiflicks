import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import S from "../styles/browseStyles";

// ─────────────────────────────────────────
// Search Bar Component
// ─────────────────────────────────────────
export default function SearchBar({ activeSearch, onSearch, onSelectMovie }) {
  const [query, setQuery]           = useState(activeSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop]     = useState(false);

  const handleInput = (value) => {
    setQuery(value);
    if (value.length > 2) {
      fetch(`${BASE_URL}/list_movies.json?query_term=${encodeURIComponent(value)}&limit=5`)
        .then(r => r.json())
        .then(d => {
          setSuggestions(d.data.movies || []);
          setShowDrop(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowDrop(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    onSelectMovie(movie.id);
    setShowDrop(false);
  };

  return (
    <div style={S.searchWrapper}>
      <div
        style={S.searchBox}
        onFocus={() => suggestions.length > 0 && setShowDrop(true)}
      >
        <input
          style={S.searchInput}
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onSearch(query);
              setShowDrop(false);
            }
          }}
        />
        {query && (
          <button
            style={S.searchClear}
            onClick={() => { setQuery(""); setSuggestions([]); }}
          >
            ✕
          </button>
        )}
      </div>

      {showDrop && suggestions.length > 0 && (
        <div style={S.dropdown}>
          {suggestions.map(movie => (
            <div
              key={movie.id}
              onClick={() => handleSuggestionClick(movie)}
              style={S.suggestion}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a2a2a")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <img
                src={movie.small_cover_image}
                alt={movie.title}
                style={S.suggestionImg}
                onError={e => (e.target.style.display = "none")}
              />
              <div style={S.suggestionInfo}>
                <p style={S.suggestionTitle}>{movie.title}</p>
                <p style={S.suggestionMeta}>{movie.year} · ⭐ {movie.rating}</p>
              </div>
            </div>
          ))}

          {/* "See all results" footer */}
          <div
            onClick={() => { onSearch(query); setShowDrop(false); }}
            style={S.seeAll}
          >
            See all results for "{query}" →
          </div>
        </div>
      )}
    </div>
  );
}
