"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FavoriteButton } from "@/components/favorite-button"
import { CompareButton } from "@/components/compare-button"
import { ChevronLeft, ChevronRight, Users, Star } from "lucide-react"

interface RoomQuickViewProps {
  room: {
    id: string
    name: string
    description: string
    price: number
    capacity: number
    amenities: string
    images: string
    avgRating?: number
    reviewCount?: number
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomQuickView({ room, open, onOpenChange }: RoomQuickViewProps) {
  const [currentImage, setCurrentImage] = useState(0)
  
  const images = JSON.parse(room.images || "[]")
  const amenities = JSON.parse(room.amenities || "[]")

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-gray-100">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImage]}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImage ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Нет изображений
              </div>
            )}
          </div>

          {/* Room Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">{room.name}</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3 mt-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {room.price.toLocaleString("ru-KZ")} ₸
              </Badge>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                {room.capacity} гостя
              </div>
              {room.avgRating && room.avgRating > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {room.avgRating.toFixed(1)}
                  {room.reviewCount && (
                    <span className="text-gray-400">({room.reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            <p className="mt-4 text-gray-600 flex-1">
              {room.description}
            </p>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Удобства</h4>
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 6).map((amenity: string) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 6 && (
                  <Badge variant="outline">+{amenities.length - 6}</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t">
              <Link href={`/rooms/${room.id}`} className="flex-1">
                <Button className="w-full">Забронировать</Button>
              </Link>
              <FavoriteButton 
                roomTypeId={room.id} 
                roomTypeName={room.name}
                variant="icon"
              />
              <CompareButton 
                roomTypeId={room.id}
                roomTypeName={room.name}
                variant="icon"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
