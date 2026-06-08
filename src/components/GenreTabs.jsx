import { ALL_GENRES } from "../utils/constants";
import DS from "../styles/dashboardStyles";

// ─────────────────────────────────────────
// Genre Tabs
// ─────────────────────────────────────────
export default function GenreTabs({ active, onChange }) {
  return (
    <div style={DS.genreTabs}>
      {ALL_GENRES.map(g => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={g === active
            ? { ...DS.genreTab, ...DS.genreTabActive }
            : DS.genreTab
          }
        >
          {g}
        </button>
      ))}
    </div>
  );
}
