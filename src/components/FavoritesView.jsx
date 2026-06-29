import { useFavorites } from "../context/FavoritesContext.jsx";
import RecipeCard from "./RecipeCard.jsx";

function FavoritesView({ onOpen }) {
  const { favorites } = useFavorites();
  const list = Object.values(favorites);

  if (list.length === 0) {
    return (
      <p>No favorites yet — click the heart on any recipe to save it here.</p>
    );
  }

  return (
    <div className="recipe-grid">
      {list.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          onOpen={() => onOpen(meal.idMeal)}
        />
      ))}
    </div>
  );
}

export default FavoritesView;
