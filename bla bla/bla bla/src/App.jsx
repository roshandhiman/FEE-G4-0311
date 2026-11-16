import { useState, useEffect } from "react";
import "./index.css";
const style = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))",
  gap: "1rem",
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.tvmaze.com/shows?page=0")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed: " + res.status);
        return res.json();
      })
      .then((data) =>
        setMovies(data.map((m) => ({ ...m, title: m.name })))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(title.trim().toLowerCase())
  );

  return (
    <div className="bgl h100 p3 fy">
      <h1 className="clr2">Movies</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="clr1">{error}</p>}
      {!loading && !error && filteredMovies.length === 0 && <p>No movies found.</p>}

      <div style={style}>
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg22 br2 sh2 fy movie-card"
            style={{ overflow: "hidden" }}
          >
            {movie.image?.medium && (
              <img
                src={movie.image.medium}
                alt={movie.title}
                style={{ width: "100%", display: "block" }}
              />
            )}
            <div className="p2 fy">
              <h3 className="fsm clr1">{movie.title}</h3>
              <p className="fss">Rating: {movie.rating?.average ?? "N/A"}</p>
              <p className="fss">{movie.premiered}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}