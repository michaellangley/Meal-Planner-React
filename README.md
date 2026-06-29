# The Weekly Board 🍲

A little recipe search \+ meal planner app I built to actually get comfortable with React — hooks, context, the works. Pulls real recipes from [TheMealDB](https://www.themealdb.com/api.php) (free API, no key needed).

## What it does

- Search recipes by name, or browse by category
- Click a recipe to see the full ingredient list and instructions
- Heart your favorites — they stick around after a refresh
- Pin recipes to days of the week on a planner board
- Auto-generates a shopping list from whatever's on the board that week, sorted A-Z
- Infinite scroll on the recipe grid instead of one giant list dump
- Proper routing (`/`, `/planner`, `/favorites`) with active nav highlighting

## Built with

- React \+ Vite
- React Router
- TheMealDB API
- Plain CSS

## Running it locally

npm install

npm run dev

Then open whatever local URL it prints.

## Why I built it this way

This started as a learning project, so the structure leans toward "demonstrate the concept clearly" rather than the absolute leanest code:

- **`context/`** — favorites and the weekly plan live in React Context so any component can read/update them without props being passed down five levels
- **`PlannerContext`** uses `useReducer` since the planner has a few different actions (assign a day, clear a day, clear the week) — felt cleaner than a pile of separate `useState` calls
- **`hooks/`** — pulled out a `useDebounce` and a `useLocalStorage` since both favorites and the planner needed persistence, and the search box needed debouncing so it's not firing a request on every keystroke
- Ingredient list parsing is its own little utility — TheMealDB packs ingredients into 20 numbered fields instead of an array, so that gets flattened into something sane once and reused wherever needed

## Things I'd add if I kept going

- Drag and drop for rearranging the planner board
- Pagination feels a bit hacky since the API itself doesn't actually paginate — would be worth revisiting if this ever needed to scale
- A full calendar planner to be able to plan weeks or even months in advance.
