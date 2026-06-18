"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "hotel_compare"
const MAX_COMPARE = 4

// Валидация данных из localStorage
const validateCompareIds = (data: unknown): string[] => {
  if (!Array.isArray(data)) return []
  return data
    .filter(id =>
      typeof id === 'string' &&
      id.length > 0 &&
      id.length < 100 &&
      /^[a-zA-Z0-9_-]+$/.test(id)
    )
    .slice(0, MAX_COMPARE)
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Инициализация из localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const validated = validateCompareIds(parsed)
        setTimeout(() => setCompareIds(validated), 0)
      } catch (error) {
        console.error('Failed to parse compare data:', error)
        setTimeout(() => setCompareIds([]), 0)
      }
    }
    setTimeout(() => setIsLoaded(true), 0)
  }, [])

  // Сохранение в localStorage при изменении compareIds
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds))
      } catch (error) {
        console.error('Failed to save compare data:', error)
      }
    }
  }, [compareIds, isLoaded])

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue)
            const validated = validateCompareIds(parsed)
            setCompareIds(validated)
          } catch {
            setCompareIds([])
          }
        } else {
          setCompareIds([])
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addToCompare = (id: string) => {
    if (compareIds.length >= MAX_COMPARE) {
      return false
    }
    if (!compareIds.includes(id)) {
      setCompareIds(prev => [...prev, id])
    }
    return true
  }

  const removeFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(cid => cid !== id))
  }

  const isInCompare = (id: string) => {
    return compareIds.includes(id)
  }

  const clearCompare = () => {
    setCompareIds([])
  }

  const toggleCompare = (id: string) => {
    if (isInCompare(id)) {
      removeFromCompare(id)
      return false
    } else {
      return addToCompare(id)
    }
  }

  return {
    compareIds,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    toggleCompare,
    count: compareIds.length,
    maxCompare: MAX_COMPARE,
    isLoaded,
  }
}
