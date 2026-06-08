import { useState, useEffect, useRef } from "react";
import { readUrl } from "./utils/helpers";
import { injectGlobalStyles } from "./utils/globalStyles";
import Dashboard from "./pages/Dashboard";
import BrowsePage from "./pages/BrowsePage";
import MovieDetail from "./pages/MovieDetail";

// Inject global CSS reset once on module load
injectGlobalStyles();

// ─────────────────────────────────────────
// Root App — handles routing and URL sync
// ─────────────────────────────────────────
export default function App() {
  const init = readUrl();

  const [view,         setView]         = useState(init.view);       // 'dashboard' | 'browse'
  const [selectedId,   setSelectedId]   = useState(init.selectedId);

  // Track previous values to decide pushState vs replaceState
  const prevIdRef   = useRef(init.selectedId);
  const prevViewRef = useRef(init.view);

  // ── Sync state → URL on every change ──
  useEffect(() => {
    const p = new URLSearchParams();
    if (view === "browse") p.set("view",  "browse");
    if (selectedId)        p.set("movie", String(selectedId));

    const qs  = p.toString();
    const url = qs ? `?${qs}` : window.location.pathname;

    // Push a new history entry only when:
    //   1. User navigates into a movie detail
    //   2. User switches from dashboard → browse
    const toMovie  = selectedId && selectedId !== prevIdRef.current;
    const toBrowse = view === "browse" && prevViewRef.current === "dashboard";

    if (toMovie || toBrowse) {
      window.history.pushState({}, "", url);
    } else {
      window.history.replaceState({}, "", url);
    }

    prevIdRef.current   = selectedId;
    prevViewRef.current = view;
  }, [view, selectedId]);

  // ── Handle browser back / forward buttons ──
  useEffect(() => {
    const onPop = () => {
      const s = readUrl();
      setView(s.view);
      setSelectedId(s.selectedId);
      prevIdRef.current   = s.selectedId;
      prevViewRef.current = s.view;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ── Route: Movie Detail ──
  if (selectedId) {
    return (
      <MovieDetail
        movieId={selectedId}
        onBack={() => setSelectedId(null)}
        onSelect={setSelectedId}
      />
    );
  }

  // ── Route: Dashboard ──
  if (view === "dashboard") {
    return (
      <Dashboard
        onBrowse={() => { setView("browse"); }}
        onSelectMovie={setSelectedId}
      />
    );
  }

  // ── Route: Browse ──
  return (
    <BrowsePage
      onSelectMovie={setSelectedId}
      onGoToDashboard={() => setView("dashboard")}
    />
  );
}
