import { useState, useEffect, useRef } from "react";

// ── Global reset: ensure full-width layout with no browser default margins ──
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 100%; }
  #root { width: 100%; }
`;
if (!document.head.querySelector("#kaiflicks-reset")) {
  globalStyle.id = "kaiflicks-reset";
  document.head.appendChild(globalStyle);
}

const BASE_URL = "https://movies-api.accel.li/api/v2";

// ─────────────────────────────────────────
// Genre list for filtering
// ─────────────────────────────────────────
const ALL_GENRES = [
  "Overall", "Action", "Adventure", "Animation", "Biography",
  "Comedy", "Crime", "Documentary", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller",
];

// ─────────────────────────────────────────
// Utility: Smart Pagination Numbers
// ─────────────────────────────────────────
function getPageNumbers(current, total) {
  const delta = 2;
  const pages = new Set([1, total]);
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
}

// ─────────────────────────────────────────
// Pagination Component
// ─────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
  const pageNumbers = getPageNumbers(page, totalPages);
  return (
    <div style={S.pagination}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        style={{ ...S.pageBtn, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>

      {pageNumbers.map((num, i) =>
        num === "..." ? (
          <span key={`e-${i}`} style={S.ellipsis}>…</span>
        ) : (
          <button key={num} onClick={() => onPageChange(num)} style={{
            ...S.pageBtn,
            backgroundColor: page === num ? "#e50914" : "transparent",
            borderColor: page === num ? "#e50914" : "#444",
            fontWeight: page === num ? "bold" : "normal",
          }}>{num}</button>
        )
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        style={{ ...S.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
    </div>
  );
}

// ─────────────────────────────────────────
// Movie Card (with hover effect)
// ─────────────────────────────────────────
function MovieCard({ movie, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...S.card, transform: hovered ? "scale(1.03)" : "scale(1)", cursor: "pointer" }}
    >
      <div style={S.posterWrapper}>
        <img src={movie.medium_cover_image} alt={movie.title} style={S.poster}
          onError={e => e.target.style.display = "none"} />
        <div style={S.ratingBadge}>⭐ {movie.rating}</div>
        {/* Hover overlay */}
        <div style={{ ...S.hoverOverlay, opacity: hovered ? 1 : 0 }}>
          <div style={S.playIcon}>▶</div>
          <span style={{ fontSize: "12px", marginTop: "6px", color: "#fff" }}>View Details</span>
        </div>
      </div>
      <div style={S.cardBody}>
        <p style={S.movieTitle}>{movie.title}</p>
        <p style={S.movieMeta}>{movie.year}</p>
        {movie.genres && <p style={S.genres}>{movie.genres.slice(0, 2).join(" · ")}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Movie Detail Page
// ─────────────────────────────────────────
function MovieDetail({ movieId, onBack, onSelect }) {
  const [movie, setMovie]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [lightbox, setLightbox] = useState(null); // index of open screenshot, or null

  useEffect(() => {
    setLoading(true);
    setMovie(null);
    setLightbox(null);
    window.scrollTo(0, 0);

    fetch(`${BASE_URL}/movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`)
      .then(res => res.json())
      .then(data => {
        setMovie(data.data.movie);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieId]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Update document title with movie info
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.year})`;
      // Update favicon to movie poster
      const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
      favicon.rel = "icon";
      favicon.href = movie.medium_cover_image || "/public/kaiflicks-icon.png";
      if (!document.querySelector("link[rel='icon']")) {
        document.head.appendChild(favicon);
      }
    }
  }, [movie]);

  if (loading) return (
    <div style={S.page}>
      <button onClick={onBack} style={S.backBtn}>← Previous Page</button>
      <div style={S.loadingBig}>⏳ Loading movie details...</div>
    </div>
  );

  if (!movie) return (
    <div style={S.page}>
      <button onClick={onBack} style={S.backBtn}>← Back</button>
      <div style={S.loadingBig}>Movie not found.</div>
    </div>
  );

  // Prefer dedicated background; fall back to large cover so the blurred hero is always present
  const hasBg = movie.background_image_original || movie.background_image
               || movie.large_cover_image || movie.medium_cover_image;

  return (
    <div style={S.detailPage}>

      {/* Blurred hero background */}
      {hasBg && (
        <>
          <div style={{ ...S.bgImage, backgroundImage: `url(${hasBg})` }} />
          <div style={S.bgOverlay} />
        </>
      )}

      {/* Centered content wrapper */}
      <div style={S.detailContent}>

      {/* Back button */}


      {/* ── TOP SECTION: Poster + Info + Similar ── */}
      <div style={S.detailTop}>

        {/* Poster column */}
        <div style={S.posterCol}>
          <img
            src={movie.large_cover_image || movie.medium_cover_image}
            alt={movie.title}
            style={S.detailPoster}
            onError={e => e.target.style.opacity = 0}
          />
        </div>

        {/* Info column */}
        <div style={S.infoCol}>
          <h1 style={S.detailTitle}>{movie.title}</h1>

          <div style={S.metaRow}>
            <span style={S.yearBadge}>{movie.year}</span>
            {movie.runtime > 0 && <span style={S.metaChip}>⏱ {movie.runtime} min</span>}
            {movie.mpa_rating && <span style={S.mpaBadge}>{movie.mpa_rating}</span>}
            {movie.language && <span style={S.metaChip}>{movie.language.toUpperCase()}</span>}
          </div>

          <p style={S.genreText}>{movie.genres?.join(" / ")}</p>

          {/* Download options — one row per quality with its own stats */}
          {movie.torrents?.length > 0 && (
            <div style={S.qualitySection}>
              <p style={S.qualityLabel}>Available in:</p>
              <div style={S.torrentTable}>
                {movie.torrents.map((t, i) => (
                  <div key={i} style={S.torrentRow}>
                    {/* Quality badge */}
                    <span style={S.qualityBadge}>
                      {t.quality}.{t.type?.toUpperCase()}
                    </span>
                    {/* Per-torrent stats */}
                    <span style={S.torrentStat}>🟢 {t.seeds} seeds</span>
                    <span style={S.torrentStat}>👥 {t.peers} peers</span>
                    <span style={S.torrentStat}>💾 {t.size}</span>
                    {/* Download link */}
                    <a href={t.url} target="_blank" rel="noreferrer" style={S.torrentDlBtn}>
                      ⬇ Download
                    </a>
                  </div>
                ))}
              </div>
              <p style={S.qualityNote}>WEB: same quality as BluRay</p>
            </div>
          )}

          {/* Ratings row */}
          <div style={S.ratingsRow}>
            <a
              href={movie.imdb_code ? `https://www.imdb.com/title/${movie.imdb_code}/` : undefined}
              target="_blank"
              rel="noreferrer"
              style={{ ...S.ratingBox, textDecoration: "none", cursor: movie.imdb_code ? "pointer" : "default", transition: "border-color 0.2s, background-color 0.2s" }}
              onMouseEnter={e => { if (movie.imdb_code) { e.currentTarget.style.borderColor = "#f5c518"; e.currentTarget.style.backgroundColor = "#2a2500"; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.backgroundColor = "#1a1a1a"; }}
              title={movie.imdb_code ? "View on IMDb" : ""}
            >
              <span style={{ color: "#f5c518", fontWeight: "900", fontSize: "16px" }}>IMDb</span>
              <span style={S.ratingNum}>{movie.rating}</span>
              <span style={S.ratingSub}>/10</span>
              {movie.imdb_code && <span style={{ fontSize: "11px", color: "#f5c518", marginLeft: "2px", opacity: 0.7 }}>↗</span>}
            </a>
            {movie.like_count > 0 && (
              <div style={S.ratingBox}>
                <span style={{ fontSize: "20px" }}>❤️</span>
                <span style={S.ratingNum}>{movie.like_count}</span>
                <span style={S.ratingSub}>likes</span>
              </div>
            )}
            {movie.download_count > 0 && (
              <div style={S.ratingBox}>
                <span style={{ fontSize: "20px" }}>⬇️</span>
                <span style={S.ratingNum}>{(movie.download_count / 1000).toFixed(0)}K</span>
                <span style={S.ratingSub}>downloads</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── BOTTOM SECTION: Trailer + Plot + Cast ── */}
      <div style={S.detailBottom}>

        {/* Trailer */}
        {movie.yt_trailer_code && (
          <div style={S.section}>
            <h3 style={S.sectionTitle}>🎞 Trailer</h3>
            <div style={S.trailerWrapper}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        )}

        {/* Plot Summary */}
        {(movie.description_full || movie.summary) && (
          <div style={S.section}>
            <h3 style={S.sectionTitle}>📖 Plot Summary</h3>
            <p style={S.plotText}>{movie.description_full || movie.summary}</p>
          </div>
        )}

        {/* Screenshots with lightbox */}
        {(() => {
          const shots = [
            movie.large_screenshot_image1 || movie.medium_screenshot_image1,
            movie.large_screenshot_image2 || movie.medium_screenshot_image2,
            movie.large_screenshot_image3 || movie.medium_screenshot_image3,
          ].filter(Boolean);
          if (!shots.length) return null;
          return (
            <>
              {/* Lightbox overlay */}
              {lightbox !== null && (
                <div
                  style={S.lightboxBackdrop}
                  onClick={() => setLightbox(null)}
                >
                  <button
                    style={S.lightboxClose}
                    onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                  >✕</button>
                  {/* Prev arrow */}
                  {lightbox > 0 && (
                    <button
                      style={{ ...S.lightboxArrow, left: "20px" }}
                      onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                    >‹</button>
                  )}
                  <img
                    src={shots[lightbox]}
                    alt={`Screenshot ${lightbox + 1}`}
                    style={S.lightboxImg}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p style={S.lightboxCaption}>{lightbox + 1} / {shots.length}</p>
                  {/* Next arrow */}
                  {lightbox < shots.length - 1 && (
                    <button
                      style={{ ...S.lightboxArrow, right: "20px" }}
                      onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                    >›</button>
                  )}
                </div>
              )}

              <div style={S.section}>
                <h3 style={S.sectionTitle}>🖼 Screenshots</h3>
                <div style={S.screenshotGrid}>
                  {shots.map((img, i) => (
                    <div
                      key={i}
                      style={S.screenshotThumb}
                      onClick={() => setLightbox(i)}
                      onMouseEnter={e => {
                        e.currentTarget.querySelector("img").style.transform = "scale(1.06)";
                        e.currentTarget.querySelector(".ss-dim").style.opacity = "1";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.querySelector("img").style.transform = "scale(1)";
                        e.currentTarget.querySelector(".ss-dim").style.opacity = "0";
                      }}
                    >
                      <img
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        style={S.screenshot}
                        onError={e => e.target.closest("div").style.display = "none"}
                      />
                      <div className="ss-dim" style={S.screenshotDim}>
                          
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <div style={S.section}>
            <h3 style={S.sectionTitle}>🎭 Top Cast</h3>
            <div style={S.castGrid}>
              {movie.cast.slice(0, 8).map((actor, i) => (
                <div key={i} style={S.castCard}>
                  <div style={S.castImgWrapper}>
                    <img
                      src={actor.url_small_image}
                      alt={actor.name}
                      style={S.castImg}
                      onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=?"; }}
                    />
                  </div>
                  <p style={S.castName}>{actor.name}</p>
                  <p style={S.castChar}>as {actor.character_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      </div>{/* end detailContent */}
    </div>
  );
}

// ─────────────────────────────────────────
// Search Bar Component
// ─────────────────────────────────────────
function SearchBar({ activeSearch, onSearch, onSelectMovie }) {
  const [query, setQuery] = useState(activeSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const handleInput = (value) => {
    setQuery(value);
    if (value.length > 2) {
      fetch(`${BASE_URL}/list_movies.json?query_term=${encodeURIComponent(value)}&limit=5`)
        .then(r => r.json())
        .then(d => { setSuggestions(d.data.movies || []); setShowDrop(true); })
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
      <div style={S.searchBox}
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
          <button style={S.searchClear} onClick={() => { setQuery(""); setSuggestions([]); }}>
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
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2a2a2a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <img
                src={movie.small_cover_image}
                alt={movie.title}
                style={S.suggestionImg}
                onError={e => e.target.style.display = "none"}
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

// ─────────────────────────────────────────
// Daily Picks Helpers
// ─────────────────────────────────────────

// Mulberry32 — fast seeded pseudo-random number generator
function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 0x100000000;
  };
}

// Returns today's date in PHT (UTC+8) as a number, e.g. 20260606
// This is the seed — same for everyone on the same PH day
function getPHTSeed() {
  const pht = new Date(Date.now() + 8 * 3600 * 1000); // shift to UTC+8
  return pht.getUTCFullYear() * 10000
    + (pht.getUTCMonth() + 1) * 100
    + pht.getUTCDate();
}

// Fisher-Yates shuffle using seeded RNG, returns n items
function seededSample(arr, n, seed) {
  const rng  = seededRng(seed);
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// Returns { hours, minutes, seconds } until next 12AM PHT
function timeUntilMidnightPHT() {
  const nowPHT      = new Date(Date.now() + 8 * 3600 * 1000);
  const nextMidnight = new Date(nowPHT);
  nextMidnight.setUTCHours(0, 0, 0, 0);
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
  const ms = nextMidnight - nowPHT;
  return {
    hours:   Math.floor(ms / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

// ─────────────────────────────────────────
// Genre Tabs
// ─────────────────────────────────────────
function GenreTabs({ active, onChange }) {
  return (
    <div style={DS.genreTabs}>
      {ALL_GENRES.map(g => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={g === active
            ? { ...DS.genreTab, ...DS.genreTabActive }
            : DS.genreTab}
        >
          {g}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Dashboard — Landing / Analytics Page
// ─────────────────────────────────────────
function DashMovieCard({ movie, rank, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...DS.card, transform: hovered ? "scale(1.05)" : "scale(1)" }}
    >
      <div style={DS.rankBadge}>{rank}</div>
      <img src={movie.medium_cover_image} alt={movie.title} style={DS.poster}
        onError={e => e.target.style.opacity = 0} />
      <div style={DS.cardInfo}>
        <p style={DS.cardTitle}>{movie.title}</p>
        <p style={DS.cardMeta}>⭐ {movie.rating} · {movie.year}</p>
      </div>
    </div>
  );
}

// MovieRow: self-fetching, has its own genre state
function MovieRow({ emoji, title, sortBy, minRating = "", onSelect, onFirstMovie }) {
  const [genre, setGenre]     = useState("Overall");
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `${BASE_URL}/list_movies.json?sort_by=${sortBy}&order_by=desc&limit=10`;
    if (minRating)           url += `&minimum_rating=${minRating}`;
    if (genre !== "Overall") url += `&genre=${encodeURIComponent(genre)}`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const list = d.data.movies || [];
        setMovies(list);
        // Only report first movie when unfiltered (Overall) — keeps stat card consistent
        if (genre === "Overall" && onFirstMovie && list[0]) onFirstMovie(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [genre, sortBy, minRating]);

  return (
    <div style={DS.rowSection}>
      <h2 style={DS.rowTitle}>
        <img src="/kaiflicks-icon.png" alt="" style={DS.rowIcon} />
        {title}
      </h2>
      <GenreTabs active={genre} onChange={(g) => { setGenre(g); }} />
      {loading
        ? <div style={DS.rowLoadingText}>⏳ Loading…</div>
        : <div style={DS.scrollOuter}>
            <div style={DS.scrollRow}>
              {movies.map((m, i) => (
                <DashMovieCard key={m.id} movie={m} rank={i + 1} onSelect={onSelect} />
              ))}
            </div>
          </div>
      }
    </div>
  );
}

// DailyPicksRow: Overall-only daily picks with seeded RNG (no genre filter)
function DailyPicksRow({ onSelect }) {
  const [picks, setPicks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const seed = getPHTSeed();
    const page = (seed % 800) + 1;

    const url = `${BASE_URL}/list_movies.json?sort_by=download_count&order_by=desc&page=${page}&limit=50`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const movies = d.data.movies || [];
        setPicks(seededSample(movies, 10, seed));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={DS.rowSection}>
      <div style={DS.picksHeader}>
        <h2 style={DS.rowTitle}>
        <img src="/kaiflicks-icon.png" alt="" style={DS.rowIcon} />
        Today's Random Picks
      </h2>
        <p style={DS.picksSub}>10 movies picked for today · refreshes every day at 12:00 AM Philippine Time</p>
      </div>
      {loading
        ? <div style={DS.rowLoadingText}>⏳ Loading…</div>
        : <div style={DS.scrollOuter}>
            <div style={DS.scrollRow}>
              {picks.map((m, i) => (
                <DashMovieCard key={m.id} movie={m} rank={i + 1} onSelect={onSelect} />
              ))}
            </div>
          </div>
      }
    </div>
  );
}

function Dashboard({ onBrowse, onSelectMovie }) {
  const [totalMovies, setTotalMovies]     = useState(0);
  const [topDownloaded, setTopDownloaded] = useState(null);
  const [topLiked, setTopLiked]           = useState(null);
  const [newestMovie, setNewestMovie]     = useState(null);
  const [loading, setLoading]             = useState(true);

  // Only fetch total count — stat card movies come directly from the rows via onFirstMovie
  // This eliminates the mismatch caused by separate API calls at different times
  useEffect(() => {
    fetch(`${BASE_URL}/list_movies.json?sort_by=download_count&order_by=desc&limit=1`)
      .then(r => r.json())
      .then(d => { setTotalMovies(d.data.movie_count || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Stats are "ready" once all three row callbacks have reported their first movie
  const statsReady = !loading && topDownloaded && topLiked && newestMovie;

  // Update document title for dashboard
  useEffect(() => {
    document.title = "Kaiflicks: Your Digital Movie Hub";
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.href = "/public/kaiflicks-icon.png";
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <div style={DS.page}>
      {/* ── Hero ── */}
      <div style={DS.hero}>
        <img src="/public/kaiflicks_logo.png" alt="KaiFlicks" style={{ maxWidth: "400px", height: "auto", marginBottom: "16px" }} />
        <div style={DS.statsRow}>
          <div style={DS.statCard}>
            {loading
              ? <span style={{ color: "#555" }}>—</span>
              : <span style={DS.statNum}>{totalMovies.toLocaleString()}</span>}
            <span style={DS.statLabel}>Total Movies</span>
          </div>
          <div
            onClick={() => topDownloaded && onSelectMovie(topDownloaded.id)}
            style={{ ...DS.statCard, cursor: topDownloaded ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{topDownloaded?.title || "Loading…"}</span>
            <span style={DS.statLabel}><img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Most Downloaded</span>
          </div>
          <div
            onClick={() => topLiked && onSelectMovie(topLiked.id)}
            style={{ ...DS.statCard, cursor: topLiked ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{topLiked?.title || "Loading…"}</span>
            <span style={DS.statLabel}><img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Most Liked</span>
          </div>
          <div
            onClick={() => newestMovie && onSelectMovie(newestMovie.id)}
            style={{ ...DS.statCard, cursor: newestMovie ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{newestMovie?.title || "Loading…"}</span>
            <span style={DS.statLabel}><img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Latest Upload</span>
          </div>
        </div>

        <button onClick={onBrowse} style={DS.browseBtn}>Browse All Movies →</button>
      </div>

      {/* ── Analytics Rows — onFirstMovie wires stat cards to row data directly ── */}
      <MovieRow emoji="🔥" title="Top 10 Most Downloaded" sortBy="download_count"       onSelect={onSelectMovie} onFirstMovie={setTopDownloaded} />
      <MovieRow emoji="⭐" title="Top 10 Highest Rated"   sortBy="rating" minRating="7" onSelect={onSelectMovie} />
      <MovieRow emoji="❤️" title="Top 10 Most Liked"      sortBy="like_count"            onSelect={onSelectMovie} onFirstMovie={setTopLiked} />
      <MovieRow emoji="🆕" title="Newest Releases"        sortBy="date_added"            onSelect={onSelectMovie} onFirstMovie={setNewestMovie} />
      <DailyPicksRow onSelect={onSelectMovie} />

      <div style={{ padding: "40px 32px", textAlign: "center" }}>
        <p style={DS.heroSub}>©: YTS API</p>
      </div>
    </div>
  );
}

// Dashboard styles
const DS = {
  page: { backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#fff", width: "100%", boxSizing: "border-box" },
  hero: {
    textAlign: "center", padding: "64px 32px 48px",
    background: "linear-gradient(180deg, #1a0505 0%, #0a0a0a 100%)",
    borderBottom: "1px solid #1f1f1f",
  },
  heroTitle: { fontSize: "56px", fontWeight: "900", margin: "0 0 10px 0", letterSpacing: "-1px" },
  heroSub:   { fontSize: "17px", color: "#888", margin: "0 0 36px 0" },
  statsRow:  { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" },
  statCard: {
    backgroundColor: "#141414", border: "1px solid #2a2a2a", borderRadius: "12px",
    padding: "18px 28px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: "6px", minWidth: "140px", transition: "border-color 0.2s",
  },
  statNum:   { fontSize: "30px", fontWeight: "800", color: "#e50914" },
  statLabel: { fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
  statIcon:  { width: "14px", height: "14px", objectFit: "contain" },
  statMovieTitle: {
    fontSize: "14px", fontWeight: "700", color: "#e50914",
    textAlign: "center", lineHeight: 1.4,
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    overflow: "hidden", maxWidth: "160px",
  },
  browseBtn: {
    backgroundColor: "#e50914", color: "#fff", border: "none", borderRadius: "8px",
    padding: "15px 36px", fontSize: "16px", fontWeight: "700", cursor: "pointer",
    letterSpacing: "0.3px", transition: "background 0.2s",
  },
  rowSection: { padding: "36px 32px 0", display: "flex", flexDirection: "column", alignItems: "center" },
  rowTitle: {
    fontSize: "20px", fontWeight: "700", margin: "0 0 10px 0", color: "#eee",
    textAlign: "center", width: "100%", maxWidth: "1400px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
  },
  rowIcon: { width: "28px", height: "28px", objectFit: "contain", flexShrink: 0 },

  // Genre tabs
  genreTabs: {
    display: "flex", gap: "6px", flexWrap: "wrap",
    marginBottom: "16px", justifyContent: "center",
    width: "100%", maxWidth: "1400px",
  },
  genreTab: {
    backgroundColor: "transparent", color: "#888",
    border: "1px solid #2a2a2a", borderRadius: "20px",
    padding: "5px 14px", fontSize: "12px", cursor: "pointer",
    transition: "all 0.15s", fontWeight: "500", whiteSpace: "nowrap",
  },
  genreTabActive: {
    backgroundColor: "#e50914", color: "#fff",
    border: "1px solid #e50914", fontWeight: "700",
  },
  rowLoadingText: { color: "#555", fontSize: "14px", padding: "20px 0", minHeight: "80px" },
  picksHeader: { marginBottom: "16px", textAlign: "center", width: "100%", maxWidth: "1400px" },
  picksSub: { fontSize: "13px", color: "#666", margin: "4px 0 0 0" },
  scrollOuter: {
    width: "100%", maxWidth: "1400px",
    overflowX: "auto", paddingBottom: "16px",
    scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent",
  },
  scrollRow: {
    display: "flex", gap: "14px", flexWrap: "nowrap",
    width: "max-content", margin: "0 auto",
  },
  card: {
    flexShrink: 0, width: "150px", cursor: "pointer", position: "relative",
    transition: "transform 0.2s", borderRadius: "8px", overflow: "hidden",
  },
  rankBadge: {
    position: "absolute", top: "8px", left: "8px", zIndex: 2,
    backgroundColor: "#e50914", color: "#fff", fontWeight: "900", fontSize: "13px",
    width: "26px", height: "26px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  poster:   { width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" },
  cardInfo: { padding: "8px 6px", backgroundColor: "#141414" },
  cardTitle: { fontSize: "12px", fontWeight: "600", color: "#ddd", margin: "0 0 3px 0", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  cardMeta:  { fontSize: "11px", color: "#777", margin: 0 },
};

// ─────────────────────────────────────────
// Deep Linking — Read state from URL
// ─────────────────────────────────────────
function readUrl() {
  const p = new URLSearchParams(window.location.search);
  return {
    view:         p.get("view")            || "dashboard",
    page:         parseInt(p.get("page"))  || 1,
    minRating:    p.get("rating")          || "",
    maxRating:    p.get("maxrating")       || "",
    fromYear:     p.get("from")            || "",
    toYear:       p.get("to")             || "",
    sortBy:       p.get("sort")            || "download_count",
    genre:        p.get("genre")           || "Overall",
    activeSearch: p.get("search")          || "",
    selectedId:   p.get("movie") ? parseInt(p.get("movie")) : null,
  };
}

// ─────────────────────────────────────────
// Main App
// ─────────────────────────────────────────
export default function App() {
  // ── Initialize all state from the current URL ──
  const init = readUrl();

  const [movies, setMovies]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(init.page);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [selectedId, setSelectedId]     = useState(init.selectedId);
  const [activeSearch, setActiveSearch] = useState(init.activeSearch);
  const [view, setView]                 = useState(init.view); // 'dashboard' | 'browse'

  // Filters — also seeded from URL
  const [minRating, setMinRating] = useState(init.minRating);
  const [maxRating, setMaxRating] = useState(init.maxRating);
  const [fromYear, setFromYear]   = useState(init.fromYear);
  const [toYear, setToYear]       = useState(init.toYear);
  const [sortBy, setSortBy]       = useState(init.sortBy);
  const [selectedGenre, setSelectedGenre] = useState(init.genre);

  // Track previous selectedId so we know when to pushState vs replaceState
  const prevIdRef   = useRef(init.selectedId);
  const prevViewRef = useRef(init.view); // track view changes for history

  // ── Sync state → URL whenever anything changes ──
  useEffect(() => {
    const p = new URLSearchParams();
    if (view === "browse")           p.set("view",   "browse");
    if (page > 1)                    p.set("page",   String(page));
    if (minRating)                   p.set("rating", minRating);
    if (maxRating)                   p.set("maxrating", maxRating);
    if (fromYear)                    p.set("from",   fromYear);
    if (toYear)                      p.set("to",     toYear);
    if (sortBy !== "download_count") p.set("sort",   sortBy);
    if (selectedGenre !== "Overall") p.set("genre",  selectedGenre);
    if (activeSearch)                p.set("search", activeSearch);
    if (selectedId)                  p.set("movie",  String(selectedId));

    const qs  = p.toString();
    const url = qs ? `?${qs}` : window.location.pathname;

    // pushState (new history entry) when:
    //   1. User navigates INTO a movie detail
    //   2. User switches from dashboard → browse (so back button returns to dashboard)
    const toMovie  = selectedId && selectedId !== prevIdRef.current;
    const toBrowse = view === "browse" && prevViewRef.current === "dashboard";

    if (toMovie || toBrowse) {
      window.history.pushState({}, "", url);
    } else {
      window.history.replaceState({}, "", url);
    }

    prevIdRef.current   = selectedId;
    prevViewRef.current = view;
  }, [view, page, minRating, maxRating, fromYear, toYear, sortBy, selectedGenre, activeSearch, selectedId]);

  // ── Handle browser back / forward buttons ──
  useEffect(() => {
    const onPop = () => {
      const s = readUrl();
      setView(s.view);
      setPage(s.page);
      setMinRating(s.minRating);
      setMaxRating(s.maxRating);
      setFromYear(s.fromYear);
      setToYear(s.toYear);
      setSortBy(s.sortBy);
      setSelectedGenre(s.genre);
      setActiveSearch(s.activeSearch);
      setSelectedId(s.selectedId);
      prevIdRef.current = s.selectedId;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (selectedId) return;
    setLoading(true);

    const isYearFiltered = !!(fromYear || toYear);

    // Map each sort option to its API sort_by + order_by values
    const sortConfig = {
      "download_count": { by: "download_count", order: "desc" },
      "rating":         { by: "rating",         order: "desc" },
      "year":           { by: "year",            order: "desc" }, // Newest First
      "year_asc":       { by: "year",            order: "asc"  }, // Oldest First
      "title":          { by: "title",           order: "asc"  },
      "like_count":     { by: "like_count",      order: "desc" },
    };
    const { by: sortByParam, order: orderByParam } = sortConfig[sortBy] || sortConfig["download_count"];

    // When year filter is active, use date_added so recently released movies
    // cluster on page 1. (sort_by=year has ordering issues on this API.)
    const apiSortBy  = isYearFiltered ? "date_added" : sortByParam;
    const apiOrderBy = isYearFiltered ? "desc"       : orderByParam;

    let url = `${BASE_URL}/list_movies.json?sort_by=${apiSortBy}&order_by=${apiOrderBy}&page=${page}&limit=50`;
    if (minRating)          url += `&minimum_rating=${minRating}`;
    if (activeSearch)       url += `&query_term=${encodeURIComponent(activeSearch)}`;
    if (selectedGenre !== "Overall") url += `&genre=${encodeURIComponent(selectedGenre)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMovies(data.data.movies || []);
        setTotalCount(data.data.movie_count);
        setTotalPages(Math.ceil(data.data.movie_count / data.data.limit));
        setLoading(false);
      })
      .catch(err => { console.error("Fetch error:", err); setLoading(false); });
  }, [page, minRating, maxRating, sortBy, fromYear, toYear, selectedId, activeSearch, selectedGenre]);

  const handleSearch = (term) => {
    setActiveSearch(term);
    setPage(1); // always reset to page 1 on new search
  };

  const isYearFiltered = !!(fromYear || toYear);

  // Update document title based on view
  useEffect(() => {
    if (view === "browse") {
      document.title = "Search and Browse Movies";
      const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
      favicon.rel = "icon";
      favicon.href = "/public/kaiflicks-icon.png";
      if (!document.querySelector("link[rel='icon']")) {
        document.head.appendChild(favicon);
      }
    }
  }, [view]);

  // Step 1: filter by year range client-side
  let filteredMovies = movies.filter(m => {
    if (fromYear && m.year < parseInt(fromYear)) return false;
    if (toYear   && m.year > parseInt(toYear))   return false;
    if (maxRating && m.rating > parseFloat(maxRating)) return false;
    return true;
  });

  // Step 2: re-sort by the user's chosen sort (since API used date_added when year filter was active)
  if (isYearFiltered) {
    filteredMovies = [...filteredMovies].sort((a, b) => {
      switch (sortBy) {
        case "rating":         return b.rating - a.rating;
        case "year":           return b.year - a.year;           // Newest First
        case "year_asc":       return a.year - b.year;           // Oldest First
        case "title":          return a.title.localeCompare(b.title);
        case "download_count": return (b.download_count || 0) - (a.download_count || 0);
        case "like_count":     return (b.like_count || 0) - (a.like_count || 0);
        default:               return 0;
      }
    });
  }

  // ── Dashboard view ──
  if (!selectedId && view === "dashboard") {
    return (
      <Dashboard
        onBrowse={() => { setView("browse"); setPage(1); }}
        onSelectMovie={setSelectedId}
      />
    );
  }

  // ── Detail view ──
  if (selectedId) {
    return (
      <MovieDetail
        movieId={selectedId}
        onBack={() => setSelectedId(null)}
        onSelect={(id) => setSelectedId(id)}
      />
    );
  }

  // ── Browse / List view ──
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        {/* Dashboard back link */}     
        <img onClick={() => setView("dashboard")} src="/public/kaiflicks-icon.png" alt="KaiFlicks" style={{ cursor: "pointer", width: "40px", height: "auto" }} />
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
          onSelectMovie={setSelectedId}
        />
      </div>

      {/* Active search banner with clear button */}
      {activeSearch && (
        <div style={S.searchBanner}>
          <span>🔍 Searching: <strong>"{activeSearch}"</strong></span>
          <button onClick={() => handleSearch("")} style={S.clearSearchBtn}>✕ Clear search</button>
        </div>
      )}

      {/* Filters */}
      <div style={S.filterBar}>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Genre</label>
          <select value={selectedGenre} onChange={e => { setSelectedGenre(e.target.value); setPage(1); }} style={S.select}>
            {ALL_GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Min Rating</label>
          <select value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }} style={S.select}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>            
            <option value="5">5+</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
            <option value="9">9+</option>
          </select>
        </div>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>Max Rating</label>
          <select value={maxRating} onChange={e => { setMaxRating(e.target.value); setPage(1); }} style={S.select}>
            <option value="">Any</option>
            <option value="2">≤ 2</option>
            <option value="3">≤ 3</option>
            <option value="4">≤ 4</option>
            <option value="5">≤ 5</option>
            <option value="6">≤ 6</option>
            <option value="7">≤ 7</option>
            <option value="8">≤ 8</option>
            <option value="9">≤ 9</option>
            <option value="10">≤ 10</option>
          </select>
        </div>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>From Year</label>
          <input type="number" value={fromYear} onChange={e => setFromYear(e.target.value)}
            placeholder="e.g. 2000" min="1900" max="2026" style={S.input} />
        </div>
        <div style={S.filterGroup}>
          <label style={S.filterLabel}>To Year</label>
          <input type="number" value={toYear} onChange={e => setToYear(e.target.value)}
            placeholder="e.g. 2024" min="1900" max="2026" style={S.input} />
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

        {/* Only show Clear when something is actually filtered */}
        {(minRating || maxRating || fromYear || toYear || sortBy !== "download_count" || activeSearch || selectedGenre !== "Overall") && (
          <button style={S.clearBtn} onClick={() => {
            setMinRating(""); setMaxRating(""); setFromYear(""); setToYear("");
            setSortBy("download_count"); setSelectedGenre("Overall"); setPage(1);
            handleSearch("");
          }}>✕ Clear</button>
        )}
      </div>

      {/* Notice shown when year filter is active */}
      {isYearFiltered && (
        <div style={S.yearNotice}>
          💡 Year filter active — fetching most recently added movies first (newer releases appear on early pages). Results on each page are then sorted by your chosen order.
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {loading ? (
        <div style={S.loading}>⏳ Loading movies...</div>
      ) : filteredMovies.length === 0 ? (
        <div style={S.loading}>No movies match your filters on this page.</div>
      ) : (
        <div style={S.grid}>
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onSelect={setSelectedId} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const S = {
  // ── Shared ──
  page: {
    padding: "24px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  loading: { textAlign: "center", padding: "60px", fontSize: "18px", color: "#888" },
  loadingBig: { textAlign: "center", padding: "100px", fontSize: "22px", color: "#888" },

  qualityBadge: { backgroundColor: "#1a3a5c", color: "#7ec8ff", border: "1px solid #2a5a8c", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" },

  // ── Header extras ──
  dashLink: { backgroundColor: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  logo: { fontSize: "32px" },
  title: { fontSize: "28px", fontWeight: "800", margin: 0, flex: 1 },
  count: { fontSize: "13px", color: "#888" },

  // ── Search Bar ──
  searchWrapper: { position: "relative", minWidth: "260px" },
  searchBox: {
    display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "#1e1e1e", border: "1px solid #333",
    borderRadius: "24px", padding: "8px 14px", transition: "border-color 0.2s",
  },
  searchIcon: { fontSize: "14px", color: "#888", flexShrink: 0 },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#fff", fontSize: "14px", minWidth: 0,
  },
  searchClear: {
    background: "none", border: "none", color: "#888",
    cursor: "pointer", fontSize: "13px", padding: "0 2px",
  },
  dropdown: {
    position: "absolute", top: "calc(100% + 8px)", right: 0, left: 0,
    backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "10px",
    overflow: "hidden", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
    minWidth: "300px",
  },
  suggestion: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 14px", cursor: "pointer", transition: "background 0.15s",
  },
  suggestionImg: { width: "36px", height: "54px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 },
  suggestionInfo: { overflow: "hidden" },
  suggestionTitle: { fontSize: "13px", fontWeight: "600", color: "#eee", margin: "0 0 3px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  suggestionMeta: { fontSize: "12px", color: "#888", margin: 0 },
  seeAll: {
    padding: "10px 14px", fontSize: "13px", color: "#e50914",
    cursor: "pointer", borderTop: "1px solid #2a2a2a", textAlign: "center",
    fontWeight: "600",
  },

  // ── Search banner ──
  searchBanner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#1a1a2e", border: "1px solid #2a2a4a",
    borderRadius: "8px", padding: "10px 16px", marginBottom: "12px",
    fontSize: "14px", color: "#aac",
  },
  clearSearchBtn: {
    backgroundColor: "transparent", color: "#e50914", border: "1px solid #e50914",
    borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer",
  },

  // ── Filter Bar ──
  filterBar: {
    display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#1a1a1a", padding: "14px 16px", borderRadius: "10px",
    marginBottom: "16px", border: "1px solid #2a2a2a",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  filterLabel: { fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" },
  select: { backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "6px", padding: "7px 10px", fontSize: "14px", cursor: "pointer" },
  input: { backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "6px", padding: "7px 10px", fontSize: "14px", width: "110px" },
  clearBtn: { backgroundColor: "transparent", color: "#e50914", border: "1px solid #e50914", borderRadius: "6px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", alignSelf: "flex-end" },
  yearNotice: { backgroundColor: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#7dbb7d", marginBottom: "4px" },

  // ── Pagination ──
  pagination: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", margin: "14px 0", justifyContent: "center" },
  pageBtn: { padding: "6px 12px", backgroundColor: "transparent", color: "#fff", border: "1px solid #444", borderRadius: "6px", cursor: "pointer", fontSize: "13px", minWidth: "38px", transition: "all 0.15s" },
  ellipsis: { color: "#555", padding: "0 4px", userSelect: "none" },

  // ── Movie Grid ──
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: "20px", marginTop: "8px", marginBottom: "20px" },

  // ── Movie Card ──
  card: { backgroundColor: "#1a1a1a", borderRadius: "10px", overflow: "hidden", border: "1px solid #2a2a2a", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" },
  posterWrapper: { position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden", backgroundColor: "#111" },
  poster: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  ratingBadge: { position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.75)", color: "#f5c518", fontSize: "12px", fontWeight: "bold", padding: "3px 7px", borderRadius: "20px" },
  hoverOverlay: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" },
  playIcon: { width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff" },
  cardBody: { padding: "10px" },
  movieTitle: { fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", lineHeight: 1.3, color: "#eee" },
  movieMeta: { fontSize: "12px", color: "#888", margin: "0 0 4px 0" },
  genres: { fontSize: "11px", color: "#666", margin: 0, fontStyle: "italic" },

  // ── Detail Page ──
  detailPage: { position: "relative", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#fff", backgroundColor: "#0f0f0f", overflowX: "hidden", width: "100%", boxSizing: "border-box" },
  bgImage: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundSize: "cover", backgroundPosition: "center top", filter: "blur(12px) brightness(0.55)", transform: "scale(1.05)", zIndex: 0 },
  bgOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(15,15,15,0.75) 45%, #0f0f0f 100%)", zIndex: 1 },
  detailContent: { position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "0 32px" },
  detailNav: { paddingTop: "20px", paddingBottom: "0", paddingLeft: "32px" },
  backBtn: { backgroundColor: "#e50914", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "14px", cursor: "pointer", fontWeight: "600" },

  // Top section layout
  detailTop: { display: "flex", gap: "32px", padding: "24px 0", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" },
  posterCol: { flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" },
  detailPoster: { width: "220px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.7)" },
  downloadBtn: { display: "block", textAlign: "center", backgroundColor: "#2ecc40", color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: "700", fontSize: "15px", textDecoration: "none" },

  infoCol: { flex: 1, minWidth: "280px" },
  detailTitle: { fontSize: "36px", fontWeight: "900", margin: "0 0 10px 0", lineHeight: 1.1 },

  metaRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px", alignItems: "center", justifyContent: "center" },
  yearBadge: { backgroundColor: "#e50914", color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: "700" },
  metaChip: { backgroundColor: "#2a2a2a", color: "#ccc", padding: "3px 10px", borderRadius: "4px", fontSize: "13px", border: "1px solid #444" },
  mpaBadge: { border: "1px solid #ccc", color: "#ccc", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" },

  genreText: { fontSize: "16px", color: "#aaa", margin: "0 0 16px 0", fontWeight: "500" },

  ratingsRow: { display: "flex", gap: "20px", marginBottom: "14px", flexWrap: "wrap" },
  ratingBox: { display: "flex", alignItems: "baseline", gap: "5px", backgroundColor: "#1a1a1a", padding: "8px 14px", borderRadius: "8px", border: "1px solid #2a2a2a" },
  ratingNum: { fontSize: "22px", fontWeight: "900", color: "#fff" },
  ratingSub: { fontSize: "12px", color: "#888" },

  plotText: { fontSize: "15px", lineHeight: 1.8, color: "#bbb" },

  // Bottom sections
  detailBottom: { paddingBottom: "40px" },
  section: { marginBottom: "36px" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid #2a2a2a", paddingBottom: "8px" },

  // Cast
  castGrid: { display: "flex", flexWrap: "wrap", gap: "16px" },
  castCard: { textAlign: "center", width: "90px" },
  castImgWrapper: { width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", backgroundColor: "#2a2a2a", border: "2px solid #333" },
  castImg: { width: "100%", height: "100%", objectFit: "cover" },
  castName: { fontSize: "12px", fontWeight: "600", color: "#ddd", margin: "0 0 2px 0" },
  castChar: { fontSize: "11px", color: "#777", margin: 0, fontStyle: "italic" },

  // Torrent & Download Info
  qualitySection: { marginBottom: "16px" },
  qualityLabel: { fontSize: "13px", color: "#888", marginRight: "8px", display: "block", marginBottom: "10px" },
  torrentTable: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" },
  torrentRow: {
    display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
    backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: "8px", padding: "8px 12px",
  },
  torrentStat: { fontSize: "13px", color: "#aaa", whiteSpace: "nowrap" },
  torrentDlBtn: {
    marginLeft: "auto", backgroundColor: "#1a3a1a", color: "#4caf50",
    border: "1px solid #2a5a2a", borderRadius: "6px",
    padding: "4px 12px", fontSize: "12px", fontWeight: "600",
    textDecoration: "none", whiteSpace: "nowrap",
  },
  qualityNote: { fontSize: "11px", color: "#555", margin: "4px 0 0 0" },
  
  // Tags/Genres
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" },
  tag: { backgroundColor: "#1e1e1e", border: "1px solid #333", color: "#aaa", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" },

  // Trailer
  trailerWrapper: { width: "100%", aspectRatio: "16/9", borderRadius: "10px", overflow: "hidden", backgroundColor: "#000" },

  // Screenshots
  screenshotGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  screenshotThumb: {
    position: "relative", borderRadius: "8px", overflow: "hidden",
    cursor: "pointer", border: "1px solid #2a2a2a",
  },
  screenshot: {
    width: "100%", aspectRatio: "16/9", objectFit: "cover",
    display: "block", transition: "transform 0.3s ease",
  },
  screenshotDim: {
    position: "absolute", inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: 0, transition: "opacity 0.25s",
  },
  screenshotZoomIcon: { fontSize: "32px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" },

  // Lightbox
  lightboxBackdrop: {
    position: "fixed", inset: 0, zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.92)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    cursor: "zoom-out",
  },
  lightboxImg: {
    maxWidth: "90vw", maxHeight: "82vh",
    borderRadius: "10px", boxShadow: "0 16px 60px rgba(0,0,0,0.8)",
    cursor: "default", objectFit: "contain",
  },
  lightboxClose: {
    position: "absolute", top: "20px", right: "28px",
    background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
    fontSize: "22px", cursor: "pointer", borderRadius: "50%",
    width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)",
  },
  lightboxArrow: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
    fontSize: "48px", cursor: "pointer", borderRadius: "8px",
    width: "52px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)", zIndex: 10,
    lineHeight: 1,
  },
  lightboxCaption: {
    color: "#999", fontSize: "13px", marginTop: "14px", letterSpacing: "1px",
  },
};