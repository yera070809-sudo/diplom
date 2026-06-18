"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Expand, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const goNext = () => setSelectedIndex((prev) => (prev + 1) % images.length)
  const goPrev = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[selectedIndex]}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                unoptimized
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 z-10" />

          {/* Expand icon */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Expand className="w-4 h-4" />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute top-1/2 left-3 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute top-1/2 right-3 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-16 flex-1 rounded-xl overflow-hidden transition-all duration-300",
                  selectedIndex === index
                    ? "ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#FAF9F6]"
                    : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                )}
              >
                <Image
                  src={img}
                  alt={`${alt} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black border-none rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Галерея изображений</DialogTitle>
          <Carousel
            className="w-full"
            opts={{ startIndex: selectedIndex }}
          >
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[80vh] w-full">
                    <Image
                      src={img}
                      alt={`${alt} ${index + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
