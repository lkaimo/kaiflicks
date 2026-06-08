import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import S from "../styles/browseStyles";

// ─────────────────────────────────────────
// Movie Detail Page
// ─────────────────────────────────────────
export default function MovieDetail({ movieId, onBack, onSelect }) {
  const [movie, setMovie]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [lightbox, setLightbox] = useState(null); // index of open screenshot, or null

  // Fetch movie details on mount / when movieId changes
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

  // Update document title and favicon when movie loads
  useEffect(() => {
    if (!movie) return;
    document.title = `${movie.title} (${movie.year})`;
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel  = "icon";
    favicon.href = movie.medium_cover_image || "/public/kaiflicks-icon.png";
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }, [movie]);

  // ── Loading / error states ──
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

  // Prefer dedicated background; fall back to cover image
  const hasBg =
    movie.background_image_original ||
    movie.background_image           ||
    movie.large_cover_image          ||
    movie.medium_cover_image;

  // Collect available screenshots
  const screenshots = [
    movie.large_screenshot_image1 || movie.medium_screenshot_image1,
    movie.large_screenshot_image2 || movie.medium_screenshot_image2,
    movie.large_screenshot_image3 || movie.medium_screenshot_image3,
  ].filter(Boolean);

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

        {/* ── TOP SECTION: Poster + Info ── */}
        <div style={S.detailTop}>

          {/* Poster column */}
          <div style={S.posterCol}>
            <img
              src={movie.large_cover_image || movie.medium_cover_image}
              alt={movie.title}
              style={S.detailPoster}
              onError={e => (e.target.style.opacity = 0)}
            />
          </div>

          {/* Info column */}
          <div style={S.infoCol}>
            <h1 style={S.detailTitle}>{movie.title}</h1>

            {/* Meta badges */}
            <div style={S.metaRow}>
              <span style={S.yearBadge}>{movie.year}</span>
              {movie.runtime > 0 && <span style={S.metaChip}>⏱ {movie.runtime} min</span>}
              {movie.mpa_rating  && <span style={S.mpaBadge}>{movie.mpa_rating}</span>}
              {movie.language    && <span style={S.metaChip}>{movie.language.toUpperCase()}</span>}
            </div>

            <p style={S.genreText}>{movie.genres?.join(" / ")}</p>

            {/* Download options — one row per torrent quality */}
            {movie.torrents?.length > 0 && (
              <div style={S.qualitySection}>
                <p style={S.qualityLabel}>Available in:</p>
                <div style={S.torrentTable}>
                  {movie.torrents.map((t, i) => (
                    <div key={i} style={S.torrentRow}>
                      <span style={S.qualityBadge}>
                        {t.quality}.{t.type?.toUpperCase()}
                      </span>
                      <span style={S.torrentStat}>🟢 {t.seeds} seeds</span>
                      <span style={S.torrentStat}>👥 {t.peers} peers</span>
                      <span style={S.torrentStat}>💾 {t.size}</span>
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
                style={{
                  ...S.ratingBox,
                  textDecoration: "none",
                  cursor: movie.imdb_code ? "pointer" : "default",
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
                onMouseEnter={e => {
                  if (movie.imdb_code) {
                    e.currentTarget.style.borderColor     = "#f5c518";
                    e.currentTarget.style.backgroundColor = "#2a2500";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor     = "#2a2a2a";
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                }}
                title={movie.imdb_code ? "View on IMDb" : ""}
              >
                <span style={{ color: "#f5c518", fontWeight: "900", fontSize: "16px" }}>IMDb</span>
                <span style={S.ratingNum}>{movie.rating}</span>
                <span style={S.ratingSub}>/10</span>
                {movie.imdb_code && (
                  <span style={{ fontSize: "11px", color: "#f5c518", marginLeft: "2px", opacity: 0.7 }}>↗</span>
                )}
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

        {/* ── BOTTOM SECTION: Trailer + Plot + Screenshots + Cast ── */}
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
          {screenshots.length > 0 && (
            <>
              {/* Lightbox overlay */}
              {lightbox !== null && (
                <div style={S.lightboxBackdrop} onClick={() => setLightbox(null)}>
                  <button
                    style={S.lightboxClose}
                    onClick={e => { e.stopPropagation(); setLightbox(null); }}
                  >
                    ✕
                  </button>

                  {lightbox > 0 && (
                    <button
                      style={{ ...S.lightboxArrow, left: "20px" }}
                      onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                    >
                      ‹
                    </button>
                  )}

                  <img
                    src={screenshots[lightbox]}
                    alt={`Screenshot ${lightbox + 1}`}
                    style={S.lightboxImg}
                    onClick={e => e.stopPropagation()}
                  />
                  <p style={S.lightboxCaption}>{lightbox + 1} / {screenshots.length}</p>

                  {lightbox < screenshots.length - 1 && (
                    <button
                      style={{ ...S.lightboxArrow, right: "20px" }}
                      onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                    >
                      ›
                    </button>
                  )}
                </div>
              )}

              <div style={S.section}>
                <h3 style={S.sectionTitle}>🖼 Screenshots</h3>
                <div style={S.screenshotGrid}>
                  {screenshots.map((img, i) => (
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
                        onError={e => (e.target.closest("div").style.display = "none")}
                      />
                      <div className="ss-dim" style={S.screenshotDim} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Top Cast */}
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
