"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Максимум ${maxImages} изображений`)
      return
    }

    setIsUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Upload failed")
        }

        const data = await res.json()
        uploadedUrls.push(data.url)
      }

      onChange([...images, ...uploadedUrls])
      toast.success(`Загружено ${uploadedUrls.length} изображений`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка загрузки")
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[dragIndex]
    newImages.splice(dragIndex, 1)
    newImages.splice(index, 0, draggedImage)
    onChange(newImages)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isUploading
            ? "border-blue-300 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Загрузка...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WebP до 5MB ({images.length}/{maxImages})
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          disabled={isUploading}
        />
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card
              key={url}
              className={cn(
                "relative group overflow-hidden aspect-video cursor-move",
                dragIndex === index && "ring-2 ring-blue-500"
              )}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <div className="absolute top-2 left-2">
                  <GripVertical className="h-5 w-5 text-white" />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* First image badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Главное
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Перетащите изображения для изменения порядка. Первое изображение будет главным.
      </p>
    </div>
  )
}
