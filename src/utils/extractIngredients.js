export function extractIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      list.push({
        ingredient: ingredient.trim(),
        measure: (measure || "").trim(),
      });
    }
  }
  return list;
}
