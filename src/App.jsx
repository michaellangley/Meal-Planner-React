import { sampleMeals } from "./data/sampleMeals";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import FavoritesView from "./components/FavoritesView.jsx";
import WeeklyBoardView from "./components/WeeklyBoardView.jsx";
import { useDebounce } from "./hooks/useDebounce";
import { useState, useEffect, useRef, useCallback } from "react";

import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const debouncedQuery = useDebounce(query, 400);
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [openMealId, setOpenMealId] = useState(null);

  const [activeTab, setActiveTab] = useState("discover");

  const [visibleCount, setVisibleCount] = useState(15);
  const visibleMeals = meals.slice(0, visibleCount);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php",
        );
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    //load page or recipes
    const controller = new AbortController();

    async function fetchMeals() {
      setStatus("loading");
      setError(null);
      try {
        const url = category
          ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
          : `https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        setMeals(data.meals || []);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    fetchMeals();

    return () => controller.abort();
  }, [debouncedQuery, category]);

  useEffect(() => {
    //set current list size
    setVisibleCount(15);
  }, [debouncedQuery, category]);

  const filteredMeals = sampleMeals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(query.toLowerCase()),
  );

  const observerRef = useRef(null);

  const sentinelCallbackRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 15, meals.length));
        }
      });

      observerRef.current.observe(node);
    },
    [meals],
  );

  return (
    <div>
      <div className="header-container">
        <h1 className="header-title">Meal Planner</h1>
        <nav className="tab-list">
          <NavLink className="tab-list-item" to="/">
            Discover
          </NavLink>
          <NavLink className="tab-list-item" to="/planner">
            Weekly Planner
          </NavLink>
          <NavLink className="tab-list-item" to="/favorites">
            Favorites
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="search-container">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search recipes..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCategory(null);
                  }}
                />
              </div>

              <div className="category-list">
                <button
                  className={`category-btn ${!category ? "active" : ""}`}
                  onClick={() => setCategory(null)}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    className={`category-btn ${category === c.strCategory ? "active" : ""}`}
                    key={c.strCategory}
                    onClick={() => {
                      setCategory(c.strCategory);
                      setQuery("");
                    }}
                  >
                    {c.strCategory}
                  </button>
                ))}
              </div>
              {status === "loading" && <p>Loading...</p>}
              {status === "error" && <p>Something went wrong: {error}</p>}
              {status === "success" && meals.length === 0 && (
                <p>No recipes found.</p>
              )}

              <div className="recipe-grid">
                {visibleMeals.map((meal) => (
                  <RecipeCard
                    key={meal.idMeal}
                    meal={meal}
                    onOpen={() => setOpenMealId(meal.idMeal)}
                  />
                ))}
              </div>
              <div ref={sentinelCallbackRef} style={{ height: "1px" }} />
              {visibleCount < meals.length && <p>Loading more...</p>}
            </>
          }
        />
        <Route
          path="/planner"
          element={<WeeklyBoardView onOpen={setOpenMealId} />}
        />
        <Route
          path="/favorites"
          element={<FavoritesView onOpen={setOpenMealId} />}
        />
      </Routes>

      {openMealId && (
        <RecipeModal mealId={openMealId} onClose={() => setOpenMealId(null)} />
      )}
    </div>
  );
}

export default App;
