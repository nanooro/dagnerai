'use client'
import React, { forwardRef, useImperativeHandle } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface CarouselRef {
  scrollPrev: () => void;
  scrollNext: () => void;
  emblaApi: any;
  getCurrentSlide: () => { id: number; title: string; content: string; bgColor: string };
}

const Carousel = forwardRef<CarouselRef>((props, ref) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    watchDrag: true,
    duration: 40
  })

  const slides = React.useMemo(() => [
    {
      id: 1,
      title: "Ai Hoshino",
      content: "The main character and famous idol",
      bgColor: "lava-gradient-1",
      image: "linear-gradient(135deg, #ff6b6b, #4ecdc4)"
    },
    {
      id: 2,
      title: "Aqua Hoshino",
      content: "Ai's son with a mysterious past",
      bgColor: "lava-gradient-2",
      image: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      id: 3,
      title: "Ruby Hoshino",
      content: "Ai's daughter and aspiring idol",
      bgColor: "lava-gradient-3",
      image: "linear-gradient(135deg, #f093fb, #f5576c)"
    },
    {
      id: 4,
      title: "Kana Arima",
      content: "Child actress turned idol",
      bgColor: "lava-gradient-4",
      image: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    {
      id: 5,
      title: "Akane Kurokawa",
      content: "Talented actress and idol",
      bgColor: "lava-gradient-5",
      image: "linear-gradient(135deg, #43e97b, #38f9d7)"
    },
    {
      id: 6,
      title: "Mem-cho",
      content: "The bubbly and energetic idol",
      bgColor: "lava-gradient-6",
      image: "linear-gradient(135deg, #fa709a, #fee140)"
    }
  ], [])

  // Debug: Log when API becomes available
  React.useEffect(() => {
    if (emblaApi) {
      console.log('Carousel API is ready:', emblaApi);
      console.log('Initial slide:', emblaApi.selectedScrollSnap());

      // Test the getCurrentSlide method
      const currentSlide = slides[emblaApi.selectedScrollSnap()];
      console.log('Current slide data:', currentSlide);
    }
  }, [emblaApi, slides])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) {
      console.log('scrollPrev called - before:', emblaApi.selectedScrollSnap());
      emblaApi.scrollPrev();
      console.log('scrollPrev called - after:', emblaApi.selectedScrollSnap());
    } else {
      console.log('scrollPrev called but emblaApi is null');
    }
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) {
      console.log('scrollNext called - before:', emblaApi.selectedScrollSnap());
      emblaApi.scrollNext();
      console.log('scrollNext called - after:', emblaApi.selectedScrollSnap());
    } else {
      console.log('scrollNext called but emblaApi is null');
    }
  }, [emblaApi])

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    scrollPrev,
    scrollNext,
    emblaApi,
    getCurrentSlide: () => {
      if (emblaApi) {
        const currentIndex = emblaApi.selectedScrollSnap();
        return slides[currentIndex] || slides[0];
      }
      return slides[0];
    }
  }), [scrollPrev, scrollNext, emblaApi, slides])

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 pointer-events-auto">
      <div className="embla h-full relative" ref={emblaRef}>
        <div className="embla__container flex h-full cursor-grab active:cursor-grabbing touch-pan-x pointer-events-none">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`embla__slide flex-[0_0_100%] min-w-0 select-none ${slide.bgColor} lava-flow`}
            >
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
                <div className="lava-particles absolute inset-0"></div>
                {/* Character gradient background */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                  style={{ background: slide.image }}
                ></div>
                <div className="text-center opacity-90 pointer-events-none relative z-10">
                  <h3 className="text-4xl font-bold mb-4 text-white">{slide.title}</h3>
                  <p className="text-xl text-white">{slide.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

Carousel.displayName = 'Carousel'

export default Carousel
