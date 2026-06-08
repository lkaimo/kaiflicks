import { useState, useEffect } from "react";

const BASE_URL =
  "https://movies-api.accel.li/api/v2/list_movies.json?sort_by=download_count";

function App() {
  const [movies, setMovies]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);         // current page
  const [totalPages, setTotalPages] = useState(1);       // total pages

  useEffect(() => {
    setLoading(true); // show loading when page changes

    fetch(`${BASE_URL}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.data.movies);

        // Calculate total pages from the API response
        const total = Math.ceil(data.data.movie_count / data.data.limit);
        setTotalPages(total);

        setLoading(false);
      });
  }, [page]); // <- re-runs every time `page` changes

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🎬 Top Rated Movies</h1>

      {/* PAGINATION BUTTONS - top */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* MOVIE GRID */}
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
          {movies.map((movie) => (
            <div key={movie.id} style={{ width: "200px" }}>
              <img src={movie.medium_cover_image} alt={movie.title} width="200" />
              <h3 style={{ fontSize: "14px" }}>{movie.title}</h3>
              <p>⭐ {movie.rating} &nbsp; 📅 {movie.year}</p>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION BUTTONS - bottom */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// Reusable Pagination Component
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", margin: "16px 0" }}>

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ padding: "8px 16px", cursor: page === 1 ? "not-allowed" : "pointer" }}
      >
        ← Prev
      </button>

      {/* Page Number Buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            padding: "8px 16px",
            backgroundColor: page === num ? "#333" : "#eee",
            color: page === num ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: page === num ? "bold" : "normal",
          }}
        >
          {num}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ padding: "8px 16px", cursor: page === totalPages ? "not-allowed" : "pointer" }}
      >
        Next →
      </button>

    </div>
  );
}

export default App;


































/*default
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

*/