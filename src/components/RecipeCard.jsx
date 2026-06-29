import { useFavorites } from "../context/FavoritesContext.jsx";

function RecipeCard({ meal, onOpen }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = Boolean(favorites[meal.idMeal]);
  return (
    <div className="recipe-card">
      <img
        className="recipe-img"
        src={meal.strMealThumb}
        alt={meal.strMeal}
        width="200"
        onClick={onOpen}
        style={{ cursor: "pointer" }}
      />
      <h3 className="recipe-title">{meal.strMeal}</h3>
      <p className="recipe-category">{meal.strCategory}</p>
      <div className="recipe-footer">
        <p>View recipe →</p>
        <button
          className="recipe-Favorite"
          onClick={() => toggleFavorite(meal)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;
