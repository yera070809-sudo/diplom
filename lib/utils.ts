import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Dynamically optimizes raw Unsplash image URLs by setting parameters for width, quality, and automatic format.
 * Reduces image size by up to 99% before client download.
 */
export function optimizeUnsplashUrl(url: string, width = 800, quality = 80): string {
  if (!url || typeof url !== "string") return url
  if (!url.includes("images.unsplash.com")) return url
  
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set("auto", "format")
    urlObj.searchParams.set("fit", "crop")
    urlObj.searchParams.set("w", width.toString())
    urlObj.searchParams.set("q", quality.toString())
    return urlObj.toString()
  } catch {
    return url
  }
}

