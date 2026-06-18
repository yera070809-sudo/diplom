"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      setTimeout(() => setFavorites(JSON.parse(stored)), 0)
    }
    setTimeout(() => setIsLoaded(true), 0)
  }, [])

  const addFavorite = (id: string) => {
    const updated = [...favorites, id]
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f !== id)
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}
