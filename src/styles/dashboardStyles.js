// ─────────────────────────────────────────
// Dashboard Styles
// ─────────────────────────────────────────
const DS = {
  page: {
    backgroundColor: "#0a0a0a", minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif", color: "#fff",
    width: "100%", boxSizing: "border-box",
  },
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
  statLabel: {
    fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "1px",
    textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
  },
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
  picksHeader:    { marginBottom: "16px", textAlign: "center", width: "100%", maxWidth: "1400px" },
  picksSub:       { fontSize: "13px", color: "#666", margin: "4px 0 0 0" },
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
  cardTitle: {
    fontSize: "12px", fontWeight: "600", color: "#ddd", margin: "0 0 3px 0", lineHeight: 1.3,
    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
  },
  cardMeta: { fontSize: "11px", color: "#777", margin: 0 },
};

export default DS;
