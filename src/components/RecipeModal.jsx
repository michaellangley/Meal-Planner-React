import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { usePlanner, DAYS } from "../context/PlannerContext.jsx";
import { extractIngredients } from "../utils/extractIngredients.js";

function RecipeModal({ mealId, onClose }) {
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("loading");
  const { favorites, toggleFavorite } = useFavorites();
  const { assignToDay } = usePlanner();
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    async function fetchMeal() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
        );
        const data = await res.json();
        if (!cancelled) {
          setMeal(data.meals ? data.meals[0] : null);
          setStatus("success");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    fetchMeal();
    return () => {
      cancelled = true;
    };
  }, [mealId]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-main"
        style={{ background: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ⛌
        </button>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>Couldn't load this recipe.</p>}
        {status === "success" && meal && (
          <>
            <div className="modal-header-grid">
              <div className="modal-header-grid-left">
                <div className="modal-header-container">
                  <h1 className="modal-header">{meal.strMeal}</h1>

                  <button
                    className="recipe-Favorite"
                    onClick={() => toggleFavorite(meal)}
                  >
                    {favorites[meal.idMeal] ? "♥" : "♡"}
                  </button>
                </div>
                <div className="content-section">
                  <label htmlFor="day-select" className="day-select-label">
                    Add to planner{" "}
                  </label>

                  <div className="day-select-container">
                    <select
                      className="day-select-input"
                      id="day-select"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <button
                      className="day-select-btn"
                      onClick={() => {
                        assignToDay(selectedDay, meal);
                        onClose();
                      }}
                    >
                      + Add to {selectedDay}
                    </button>
                  </div>
                </div>

                <div className="content-section">
                  <h2>Ingredients</h2>
                  <div className="ingredient-list">
                    {extractIngredients(meal).map((item, i) => (
                      <div className="ingredient-item">
                        <span className="ingredient-name">
                          {item.ingredient}
                        </span>{" "}
                        <span className="ingredient-measure">
                          {item.measure}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-header-grid-right">
                <img
                  className="modal-main-img"
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  width="300"
                />
              </div>
            </div>

            <div className="content-section">
              <h2>Instructions</h2>
              <p className="meal-instructions">{meal.strInstructions}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeModal;
