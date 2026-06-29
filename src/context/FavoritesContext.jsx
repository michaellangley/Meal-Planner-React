import { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('favorites', {})

  function toggleFavorite(meal) {
    setFavorites((prev) => {
      const next = { ...prev }
      if (next[meal.idMeal]) {
        delete next[meal.idMeal]
      } else {
        next[meal.idMeal] = meal
      }
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}