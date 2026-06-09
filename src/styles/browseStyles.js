// ─────────────────────────────────────────
// Browse Page Styles
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
  loading:    { textAlign: "center", padding: "60px", fontSize: "18px", color: "#888" },
  loadingBig: { textAlign: "center", padding: "100px", fontSize: "22px", color: "#888" },

  qualityBadge: {
    backgroundColor: "#1a3a5c", color: "#7ec8ff",
    border: "1px solid #2a5a8c", padding: "4px 10px",
    borderRadius: "4px", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap",
  },

  // ── Header ──
  dashLink: {
    backgroundColor: "transparent", color: "#aaa",
    border: "1px solid #333", borderRadius: "6px",
    padding: "6px 12px", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
  },
  header:  { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  logo:    { fontSize: "32px" },
  title:   { fontSize: "28px", fontWeight: "800", margin: 0, flex: 1, color: 'white' },
  count:   { fontSize: "13px", color: "#888" },

  // ── Search Bar ──
  searchWrapper: { position: "relative", minWidth: "260px" },
  searchBox: {
    display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "#1e1e1e", border: "1px solid #333",
    borderRadius: "24px", padding: "8px 14px", transition: "border-color 0.2s",
  },
  searchIcon:  { fontSize: "14px", color: "#888", flexShrink: 0 },
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
  suggestionImg:   { width: "36px", height: "54px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 },
  suggestionInfo:  { overflow: "hidden" },
  suggestionTitle: { fontSize: "13px", fontWeight: "600", color: "#eee", margin: "0 0 3px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  suggestionMeta:  { fontSize: "12px", color: "#888", margin: 0 },
  seeAll: {
    padding: "10px 14px", fontSize: "13px", color: "#e50914",
    cursor: "pointer", borderTop: "1px solid #2a2a2a",
    textAlign: "center", fontWeight: "600",
  },

  // ── Search Banner ──
  searchBanner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#1a1a2e", border: "1px solid #2a2a4a",
    borderRadius: "8px", padding: "10px 16px", marginBottom: "12px",
    fontSize: "14px", color: "#aac",
  },
  clearSearchBtn: {
    backgroundColor: "transparent", color: "#e50914",
    border: "1px solid #e50914", borderRadius: "6px",
    padding: "4px 12px", fontSize: "12px", cursor: "pointer",
  },

  // ── Filter Bar ──
  filterBar: {
    display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end",
    justifyContent: "center", backgroundColor: "#1a1a1a",
    padding: "14px 16px", borderRadius: "10px",
    marginBottom: "16px", border: "1px solid #2a2a2a",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  filterLabel: { fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" },
  select: {
    backgroundColor: "#2a2a2a", color: "#fff",
    border: "1px solid #444", borderRadius: "6px",
    padding: "7px 10px", fontSize: "14px", cursor: "pointer",
  },
  input: {
    backgroundColor: "#2a2a2a", color: "#fff",
    border: "1px solid #444", borderRadius: "6px",
    padding: "7px 10px", fontSize: "14px", width: "110px",
  },
  clearBtn: {
    backgroundColor: "transparent", color: "#e50914",
    border: "1px solid #e50914", borderRadius: "6px",
    padding: "7px 14px", fontSize: "13px", cursor: "pointer", alignSelf: "flex-end",
  },
  yearNotice: {
    backgroundColor: "#1a2a1a", border: "1px solid #2a4a2a",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#7dbb7d", marginBottom: "4px",
  },

  // ── Pagination ──
  pagination: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", margin: "14px 0", justifyContent: "center" },
  pageBtn:    { padding: "6px 12px", backgroundColor: "transparent", color: "#fff", border: "1px solid #444", borderRadius: "6px", cursor: "pointer", fontSize: "13px", minWidth: "38px", transition: "all 0.15s" },
  ellipsis:   { color: "#555", padding: "0 4px", userSelect: "none" },

  // ── Movie Grid ──
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: "20px", marginTop: "8px", marginBottom: "20px" },

  // ── Movie Card ──
  card:          { backgroundColor: "#1a1a1a", borderRadius: "10px", overflow: "hidden", border: "1px solid #2a2a2a", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" },
  posterWrapper: { position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden", backgroundColor: "#111" },
  poster:        { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  ratingBadge:   { position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.75)", color: "#f5c518", fontSize: "12px", fontWeight: "bold", padding: "3px 7px", borderRadius: "20px" },
  hoverOverlay:  { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" },
  playIcon:      { width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff" },
  cardBody:      { padding: "10px" },
  movieTitle:    { fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0", lineHeight: 1.3, color: "#eee" },
  movieMeta:     { fontSize: "12px", color: "#888", margin: "0 0 4px 0" },
  genres:        { fontSize: "11px", color: "#666", margin: 0, fontStyle: "italic" },

  // ── Detail Page ──
  detailPage:    { position: "relative", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#fff", backgroundColor: "#0f0f0f", overflowX: "hidden", width: "100%", boxSizing: "border-box" },
  bgImage:       { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundSize: "cover", backgroundPosition: "center top", filter: "blur(12px) brightness(0.55)", transform: "scale(1.05)", zIndex: 0 },
  bgOverlay:     { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(15,15,15,0.75) 45%, #0f0f0f 100%)", zIndex: 1 },
  detailContent: { position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "0 32px" },
  detailNav:     { paddingTop: "20px", paddingBottom: "0", paddingLeft: "32px" },
  backBtn:       { backgroundColor: "#e50914", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "14px", cursor: "pointer", fontWeight: "600" },

  // Top section layout
  detailTop:   { display: "flex", gap: "32px", padding: "24px 0", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" },
  posterCol:   { flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" },
  detailPoster: { width: "220px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.7)" },
  downloadBtn: { display: "block", textAlign: "center", backgroundColor: "#2ecc40", color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: "700", fontSize: "15px", textDecoration: "none" },

  infoCol:     { flex: 1, minWidth: "280px" },
  detailTitle: { fontSize: "36px", fontWeight: "900", margin: "0 0 10px 0", color: 'white', lineHeight: 1.1 },

  metaRow:   { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px", alignItems: "center", justifyContent: "center" },
  yearBadge: { backgroundColor: "#e50914", color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: "700" },
  metaChip:  { backgroundColor: "#2a2a2a", color: "#ccc", padding: "3px 10px", borderRadius: "4px", fontSize: "13px", border: "1px solid #444" },
  mpaBadge:  { border: "1px solid #ccc", color: "#ccc", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" },

  genreText:   { fontSize: "16px", color: "#aaa", margin: "0 0 16px 0", fontWeight: "500" },

  ratingsRow:  { display: "flex", gap: "20px", marginBottom: "14px", flexWrap: "wrap" },
  ratingBox:   { display: "flex", alignItems: "baseline", gap: "5px", backgroundColor: "#1a1a1a", padding: "8px 14px", borderRadius: "8px", border: "1px solid #2a2a2a" },
  ratingNum:   { fontSize: "22px", fontWeight: "900", color: "#fff" },
  ratingSub:   { fontSize: "12px", color: "#888" },

  plotText: { fontSize: "15px", lineHeight: 1.8, color: "#bbb" },

  // Bottom sections
  detailBottom: { paddingBottom: "40px" },
  section:      { marginBottom: "36px" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid #2a2a2a", paddingBottom: "8px" },

  // Cast
  castGrid:       { display: "flex", flexWrap: "wrap", gap: "16px" },
  castCard:       { textAlign: "center", width: "90px" },
  castImgWrapper: { width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", backgroundColor: "#2a2a2a", border: "2px solid #333" },
  castImg:        { width: "100%", height: "100%", objectFit: "cover" },
  castName:       { fontSize: "12px", fontWeight: "600", color: "#ddd", margin: "0 0 2px 0" },
  castChar:       { fontSize: "11px", color: "#777", margin: 0, fontStyle: "italic" },

  // Torrent & Download Info
  qualitySection: { marginBottom: "16px" },
  qualityLabel:   { fontSize: "13px", color: "#888", marginRight: "8px", display: "block", marginBottom: "10px" },
  torrentTable:   { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" },
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

  // Tags / Genres
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" },
  tag:     { backgroundColor: "#1e1e1e", border: "1px solid #333", color: "#aaa", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" },

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
    backdropFilter: "blur(4px)", zIndex: 10, lineHeight: 1,
  },
  lightboxCaption: {
    color: "#999", fontSize: "13px", marginTop: "14px", letterSpacing: "1px",
  },
};

export default S;
