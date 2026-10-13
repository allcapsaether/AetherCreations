'use client'

import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CarouselItem = {
  id: number
  slug: string
  name: string
  type: string
  image: string
  price: string
}

type ProductCarouselProps = {
  items: CarouselItem[]
  label: string
  highlight?: boolean
  size?: 'lg' | 'md'
}

export function ProductCarousel({
  items,
  label,
  highlight = false,
  size = 'md',
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
  })
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || paused) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const timer = window.setInterval(() => emblaApi.scrollNext(), 5000)
    return () => window.clearInterval(timer)
  }, [emblaApi, paused])

  const slideBasis =
    size === 'lg'
      ? 'basis-[85%] sm:basis-[60%] lg:basis-[45%]'
      : 'basis-[75%] sm:basis-[45%] lg:basis-[30%]'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y">
          {items.map((item, index) => {
            const isActive = highlight && index === selected
            return (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${items.length}`}
                className={cn('min-w-0 shrink-0 grow-0 pl-4', slideBasis)}
              >
                <Link
                  href={`/products/${item.slug}`}
                  className={cn(
                    'group flex flex-col border bg-card transition-all duration-500',
                    isActive
                      ? 'border-luxe'
                      : highlight
                        ? 'border-border opacity-60 hover:opacity-100'
                        : 'border-border hover:border-foreground/40',
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 85vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index < 2}
                    />
                    {isActive && (
                      <span className="absolute left-4 top-4 bg-luxe px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-luxe-foreground">
                        Highlight
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {item.type}
                      </p>
                      <h3 className="mt-1 font-serif text-xl">{item.name}</h3>
                    </div>
                    <p className="text-sm tabular-nums">{item.price}</p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                'h-px transition-all duration-500',
                index === selected ? 'w-10 bg-luxe' : 'w-5 bg-foreground/25',
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="flex size-10 items-center justify-center border border-border transition-colors hover:border-foreground"
            aria-label="Previous slide"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="flex size-10 items-center justify-center border border-border transition-colors hover:border-foreground"
            aria-label="Next slide"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
