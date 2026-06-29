import { useFavorites } from "../context/FavoritesContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import { usePlanner, DAYS } from "../context/PlannerContext.jsx";
import { extractIngredients } from "../utils/extractIngredients.js";

function WeeklyBoardView({ onOpen }) {
  const { plan, clearDay, clearWeek } = usePlanner();

  const assignedMeals = DAYS.map((day) => plan[day]).filter(Boolean);

  const shoppingList = assignedMeals
    .flatMap((meal) => extractIngredients(meal))
    .reduce((acc, item) => {
      const key = item.ingredient.toLowerCase();
      if (!acc[key]) {
        acc[key] = { ingredient: item.ingredient, measures: [] };
      }
      acc[key].measures.push(item.measure);
      return acc;
    }, {});

  const sortedShoppingList = Object.values(shoppingList).sort((a, b) =>
    a.ingredient.localeCompare(b.ingredient),
  );
  return (
    <div className="planner-page">
      <div className="planner-layout">
        <div className="planner-list">
          {DAYS.map((day) => {
            const meal = plan[day];
            return (
              <div className="planner-day" key={day}>
                <div className="planner-day-title">{day}</div>
                {meal ? (
                  <div className="planner-day-meal">
                    <img
                      className="planner-day-meal-img"
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      width="80"
                      onClick={() => onOpen(meal.idMeal)}
                      style={{ cursor: "pointer" }}
                    />
                    <p className="planner-day-meal-title">{meal.strMeal}</p>
                    <button
                      className="planner-day-meal-remove"
                      onClick={() => clearDay(day)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="planner-day-empty">Empty</p>
                )}
              </div>
            );
          })}
          {/* 
          {assignedMeals.length >= 1 && (
            <button className="clearWeek-btn" onClick={clearWeek}>
              Clear week
            </button>
          )} */}
        </div>
        <div className="notebook">
          <h3>Shopping list</h3>
          {Object.keys(sortedShoppingList).length === 0 ? (
            <p className="empty-list">
              Add meals to the board to build a shopping list.
            </p>
          ) : (
            <ul>
              {Object.values(sortedShoppingList).map((item) => (
                <li key={item.ingredient}>
                  <span className="ingredient">{item.ingredient}</span>{" "}
                  <span className="measure">
                    {item.measures.filter(Boolean).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeeklyBoardView;
