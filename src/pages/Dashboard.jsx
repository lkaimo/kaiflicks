import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { getPHTSeed, seededSample } from "../utils/helpers";
import GenreTabs from "../components/GenreTabs";
import DS from "../styles/dashboardStyles";

// ─────────────────────────────────────────
// Dashboard Movie Card
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
      <img
        src={movie.medium_cover_image}
        alt={movie.title}
        style={DS.poster}
        onError={e => (e.target.style.opacity = 0)}
      />
      <div style={DS.cardInfo}>
        <p style={DS.cardTitle}>{movie.title}</p>
        <p style={DS.cardMeta}>⭐ {movie.rating} · {movie.year}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Movie Row — self-fetching, filterable by genre
// ─────────────────────────────────────────
function MovieRow({ title, sortBy, minRating = "", onSelect, onFirstMovie }) {
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
        // Report first movie only when unfiltered — keeps stat card consistent
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
      <GenreTabs active={genre} onChange={setGenre} />

      {loading ? (
        <div style={DS.rowLoadingText}>⏳ Loading…</div>
      ) : (
        <div style={DS.scrollOuter}>
          <div style={DS.scrollRow}>
            {movies.map((m, i) => (
              <DashMovieCard key={m.id} movie={m} rank={i + 1} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Daily Picks Row — seeded RNG, no genre filter
// ─────────────────────────────────────────
function DailyPicksRow({ onSelect }) {
  const [picks, setPicks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const seed = getPHTSeed();
    const page = (seed % 800) + 1;
    const url  = `${BASE_URL}/list_movies.json?sort_by=download_count&order_by=desc&page=${page}&limit=50`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        setPicks(seededSample(d.data.movies || [], 10, seed));
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
        <p style={DS.picksSub}>
          10 movies picked for today · refreshes every day at 12:00 AM Philippine Time
        </p>
      </div>

      {loading ? (
        <div style={DS.rowLoadingText}>⏳ Loading…</div>
      ) : (
        <div style={DS.scrollOuter}>
          <div style={DS.scrollRow}>
            {picks.map((m, i) => (
              <DashMovieCard key={m.id} movie={m} rank={i + 1} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Dashboard — Landing / Analytics Page
// ─────────────────────────────────────────
export default function Dashboard({ onBrowse, onSelectMovie }) {
  const [totalMovies,   setTotalMovies]   = useState(0);
  const [topDownloaded, setTopDownloaded] = useState(null);
  const [topLiked,      setTopLiked]      = useState(null);
  const [newestMovie,   setNewestMovie]   = useState(null);
  const [loading,       setLoading]       = useState(true);

  // Fetch total movie count only — stat card movies come from rows via onFirstMovie
  useEffect(() => {
    fetch(`${BASE_URL}/list_movies.json?sort_by=download_count&order_by=desc&limit=1`)
      .then(r => r.json())
      .then(d => { setTotalMovies(d.data.movie_count || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Update document title and favicon for dashboard
  useEffect(() => {
    document.title = "Kaiflicks: Your Digital Movie Hub";
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel  = "icon";
    favicon.href = "/kaiflicks-icon.png";
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <div style={DS.page}>

      {/* ── Hero ── */}
      <div style={DS.hero}>
        <img
          src="/kaiflicks_logo.png"
          alt="KaiFlicks"
          style={{ maxWidth: "400px", height: "auto", marginBottom: "16px" }}
        />

        {/* Stat cards */}
        <div style={DS.statsRow}>
          <div style={DS.statCard}>
            {loading
              ? <span style={{ color: "#555" }}>—</span>
              : <span style={DS.statNum}>{totalMovies.toLocaleString()}</span>
            }
            <span style={DS.statLabel}>Total Movies</span>
          </div>

          <div
            onClick={() => topDownloaded && onSelectMovie(topDownloaded.id)}
            style={{ ...DS.statCard, cursor: topDownloaded ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{topDownloaded?.title || "Loading…"}</span>
            <span style={DS.statLabel}>
              <img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Most Downloaded
            </span>
          </div>

          <div
            onClick={() => topLiked && onSelectMovie(topLiked.id)}
            style={{ ...DS.statCard, cursor: topLiked ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{topLiked?.title || "Loading…"}</span>
            <span style={DS.statLabel}>
              <img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Most Liked
            </span>
          </div>

          <div
            onClick={() => newestMovie && onSelectMovie(newestMovie.id)}
            style={{ ...DS.statCard, cursor: newestMovie ? "pointer" : "default" }}
          >
            <span style={DS.statMovieTitle}>{newestMovie?.title || "Loading…"}</span>
            <span style={DS.statLabel}>
              <img src="/kaiflicks-icon.png" alt="" style={DS.statIcon} /> Latest Upload
            </span>
          </div>
        </div>

        <button onClick={onBrowse} style={DS.browseBtn}>Browse All Movies →</button>
      </div>

      {/* ── Movie Rows ── */}
      <MovieRow title="Top 10 Most Downloaded" sortBy="download_count"       onSelect={onSelectMovie} onFirstMovie={setTopDownloaded} />
      <MovieRow title="Top 10 Highest Rated"   sortBy="rating" minRating="7" onSelect={onSelectMovie} />
      <MovieRow title="Top 10 Most Liked"      sortBy="like_count"           onSelect={onSelectMovie} onFirstMovie={setTopLiked} />
      <MovieRow title="Newest Uploads"        sortBy="date_added"           onSelect={onSelectMovie} onFirstMovie={setNewestMovie} />
      <DailyPicksRow onSelect={onSelectMovie} />

      <div style={{ padding: "40px 32px", textAlign: "center" }}>
        <p style={DS.heroSub}>©: YTS API</p>
      </div>
    </div>
  );
}
