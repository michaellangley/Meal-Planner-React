import { createContext, useContext, useReducer, useEffect } from "react";

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialState = Object.fromEntries(DAYS.map((d) => [d, null]));

const STORAGE_KEY = "weekly-board-plan";

function loadInitialState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through to default
  }
  return initialState;
}

function plannerReducer(state, action) {
  switch (action.type) {
    case "ASSIGN_TO_DAY":
      return { ...state, [action.payload.day]: action.payload.meal };
    case "CLEAR_DAY":
      return { ...state, [action.payload.day]: null };
    case "CLEAR_WEEK":
      return Object.fromEntries(DAYS.map((d) => [d, null]));
    default:
      return state;
  }
}

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [plan, dispatch] = useReducer(
    plannerReducer,
    initialState,
    loadInitialState,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // ignore storage failures
    }
  }, [plan]);

  const assignToDay = (day, meal) =>
    dispatch({ type: "ASSIGN_TO_DAY", payload: { day, meal } });
  const clearDay = (day) => dispatch({ type: "CLEAR_DAY", payload: { day } });
  const clearWeek = () => dispatch({ type: "CLEAR_WEEK" });

  return (
    <PlannerContext.Provider value={{ plan, assignToDay, clearDay, clearWeek }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  return useContext(PlannerContext);
}
