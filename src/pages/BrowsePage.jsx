import { useState, useEffect, useRef } from "react";
import { BASE_URL, ALL_GENRES } from "../utils/constants";
import { readUrl } from "../utils/helpers";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import S from "../styles/browseStyles";

// ─────────────────────────────────────────
// Browse / List View
// ─────────────────────────────────────────
export default function BrowsePage({ onSelectMovie, onGoToDashboard }) {
  const init = readUrl();

  const [movies,       setMovies]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(init.page);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [activeSearch, setActiveSearch] = useState(init.activeSearch);

  // Filters — seeded from URL on first render
  const [minRating,     setMinRating]     = useState(init.minRating);
  const [maxRating,     setMaxRating]     = useState(init.maxRating);
  const [fromYear,      setFromYear]      = useState(init.fromYear);
  const [toYear,        setToYear]        = useState(init.toYear);
  const [sortBy,        setSortBy]        = useState(init.sortBy);
  const [selectedGenre, setSelectedGenre] = useState(init.genre);

  // ── Fetch movies ──
  useEffect(() => {
    setLoading(true);

    const isYearFiltered = !!(fromYear || toYear);

    const sortConfig = {
      "download_count": { by: "download_count", order: "desc" },
      "rating":         { by: "rating",         order: "desc" },
      "year":           { by: "year",            order: "desc" },
      "year_asc":       { by: "year",            order: "asc"  },
      "title":          { by: "title",           order: "asc"  },
      "like_count":     { by: "like_count",      order: "desc" },
    };
    const { by: sortByParam, order: orderByParam } =
      sortConfig[sortBy] || sortConfig["download_count"];

    // When year filter is active, use date_added so recently added movies
    // cluster on page 1. Client-side re-sort is applied below.
    const apiSortBy  = isYearFiltered ? "date_added" : sortByParam;
    const apiOrderBy = isYearFiltered ? "desc"       : orderByParam;

    let url = `${BASE_URL}/list_movies.json?sort_by=${apiSortBy}&order_by=${apiOrderBy}&page=${page}&limit=50`;
    if (minRating)                    url += `&minimum_rating=${minRating}`;
    if (activeSearch)                 url += `&query_term=${encodeURIComponent(activeSearch)}`;
    if (selectedGenre !== "Overall")  url += `&genre=${encodeURIComponent(selectedGenre)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMovies(data.data.movies || []);
        setTotalCount(data.data.movie_count);
        setTotalPages(Math.ceil(data.data.movie_count / data.data.limit));
        setLoading(false);
      })
      .catch(err => { console.error("Fetch error:", err); setLoading(false); });
  }, [page, minRating, maxRating, sortBy, fromYear, toYear, activeSearch, selectedGenre]);

  // ── Update document title when browse view is active ──
  useEffect(() => {
    document.title = "Search and Browse Movies";
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel  = "icon";
    favicon.href = "/kaiflicks-icon.png";
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }, []);

  const handleSearch = (term) => {
    setActiveSearch(term);
    setPage(1);
  };

  const clearFilters = () => {
    setMinRating(""); setMaxRating("");
    setFromYear(""); setToYear("");
    setSortBy("download_count");
    setSelectedGenre("Overall");
    setPage(1);
    handleSearch("");
  };

  const isYearFiltered = !!(fromYear || toYear);
  const hasActiveFilters =
    minRating || maxRating || fromYear || toYear ||
    sortBy !== "download_count" || activeSearch || selectedGenre !== "Overall";

  // Step 1: filter by year range and max rating client-side
  let filteredMovies = movies.filter(m => {
    if (fromYear  && m.year   < parseInt(fromYear))        return false;
    if (toYear    && m.year   > parseInt(toYear))          return false;
    if (maxRating && m.rating > parseFloat(maxRating))     return false;
    return true;
  });

  // Step 2: re-sort if year filter is active (API used date_added instead)
  if (isYearFiltered) {
    filteredMovies = [...filteredMovies].sort((a, b) => {
      switch (sortBy) {
        case "rating":         return b.rating - a.rating;
        case "year":           return b.year - a.year;
        case "year_asc":       return a.year - b.year;
        case "title":          return a.title.localeCompare(b.title);
        case "download_count": return (b.download_count || 0) - (a.download_count || 0);
        case "like_count":     return (b.like_count || 0) - (a.like_count || 0);
        default:               return 0;
      }
    });
  }

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <div style={S.header}>
        <img
          onClick={onGoToDashboard}
          src="/public/kaiflicks-icon.png"
          alt="KaiFlicks"
          style={{ cursor: "pointer", width: "40px", height: "auto" }}
        />
        <h1 style={S.title}>
          {activeSearch ? `Results for "${activeSearch}"` : "Browse Movies"}
        </h1>
        {!loading && (
          <span style={S.count}>
            {isYearFiltered && !activeSearch
              ? `${filteredMovies.length} shown on this page · ${totalCount.toLocaleString()} total`
              : `${totalCount.toLocaleString()} movies found`}
          </span>
        )}
        <SearchBar
          activeSearch={activeSearch}
          onSearch={handleSearch}
          onSelectMovie={onSelectMovie}
        />
      </div>

      {/* Active search banner */}
      {activeSearch && (
        <div style={S.searchBanner}>
          <span>🔍 Searching: <strong>"{activeSearch}"</strong></span>
          <button onClick={() => handleSearch("")} style={S.clearSearchBtn}>✕ Clear search</button>
        </div>
      )}

      {/* ── Filters ── */}
      <div style={S.filterBar}>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Genre</label>
          <select value={selectedGenre} onChange={e => { setSelectedGenre(e.target.value); setPage(1); }} style={S.select}>
            {ALL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Min Rating</label>
          <select value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }} style={S.select}>
            <option value="">Any</option>
            {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>

        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Max Rating</label>
          <select value={maxRating} onChange={e => { setMaxRating(e.target.value); setPage(1); }} style={S.select}>
            <option value="">Any</option>
            {[2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>≤ {n}</option>)}
          </select>
        </div>

        <div style={S.filterGroup}>
          <label style={S.filterLabel}>From Year</label>
          <input
            type="number" value={fromYear}
            onChange={e => setFromYear(e.target.value)}
            placeholder="e.g. 2000" min="1900" max="2026"
            style={S.input}
          />
        </div>

        <div style={S.filterGroup}>
          <label style={S.filterLabel}>To Year</label>
          <input
            type="number" value={toYear}
            onChange={e => setToYear(e.target.value)}
            placeholder="e.g. 2024" min="1900" max="2026"
            style={S.input}
          />
        </div>

        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Sort By</label>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={S.select}>
            <option value="download_count">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="year">Newest First</option>
            <option value="year_asc">Oldest First</option>
            <option value="title">A → Z</option>
            <option value="like_count">Most Liked</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button style={S.clearBtn} onClick={clearFilters}>✕ Clear</button>
        )}
      </div>

      {/* Year filter notice */}
      {isYearFiltered && (
        <div style={S.yearNotice}>
          💡 Year filter active — fetching most recently added movies first (newer releases appear on early pages).
          Results on each page are then sorted by your chosen order.
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Movie grid */}
      {loading ? (
        <div style={S.loading}>⏳ Loading movies...</div>
      ) : filteredMovies.length === 0 ? (
        <div style={S.loading}>No movies match your filters on this page.</div>
      ) : (
        <div style={S.grid}>
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
