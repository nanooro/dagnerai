"use client"
import { Button } from '@/components/ui/button'
import Carousel from '@/components/carousel'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

interface CarouselRef {
  scrollPrev: () => void;
  scrollNext: () => void;
  emblaApi: {
    on: (event: string, callback: () => void) => void;
    off: (event: string, callback: () => void) => void;
    selectedScrollSnap: () => number;
  } | null;
  getCurrentSlide: () => { id: number; title: string; content: string; bgColor: string };
}

export default function Home() {
  const carouselRef = useRef<CarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState<{ id: number; title: string; content: string; bgColor: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with first slide data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current) {
        try {
          const slide = carouselRef.current.getCurrentSlide();
          console.log('Initial slide data:', slide);
          if (slide && typeof slide === 'object' && slide.title) {
            setCurrentSlide(slide);
          }
        } catch (error) {
          console.error('Error getting initial slide:', error);
        }
      }
      setIsLoading(false);
    }, 200); // Increased delay to ensure carousel is ready
    return () => clearTimeout(timer);
  }, []);

  const handlePrevClick = () => {
    console.log('Previous button clicked - calling scrollPrev');
    if (carouselRef.current) {
      carouselRef.current.scrollPrev();
      // Manually update the slide display
      setTimeout(() => {
        try {
          const slide = carouselRef.current?.getCurrentSlide();
          console.log('Manual update - Previous slide:', slide);
          if (slide && typeof slide === 'object' && slide.title) {
            setCurrentSlide(slide);
          }
        } catch (error) {
          console.error('Error updating previous slide:', error);
        }
      }, 50);
    }
  };

  const handleNextClick = () => {
    console.log('Next button clicked - calling scrollNext');
    if (carouselRef.current) {
      carouselRef.current.scrollNext();
      // Manually update the slide display
      setTimeout(() => {
        try {
          const slide = carouselRef.current?.getCurrentSlide();
          console.log('Manual update - Next slide:', slide);
          if (slide && typeof slide === 'object' && slide.title) {
            setCurrentSlide(slide);
          }
        } catch (error) {
          console.error('Error updating next slide:', error);
        }
      }, 50);
    }
  };

  // Update current slide when carousel changes
  useEffect(() => {
    const checkCarousel = () => {
      if (carouselRef.current) {
        const updateSlide = () => {
          try {
            const slide = carouselRef.current?.getCurrentSlide();
            console.log('Event listener triggered - Current slide:', slide);
            if (slide && typeof slide === 'object' && slide.title) {
              setCurrentSlide(slide);
            } else {
              console.warn('Invalid slide data received:', slide);
            }
          } catch (error) {
            console.error('Error updating slide:', error);
          }
        };

        updateSlide(); // Initial call

        // Set up event listener if API is available
        if (carouselRef.current.emblaApi) {
          const api = carouselRef.current.emblaApi;
          console.log('Setting up event listener for carousel changes');
          api.on('select', updateSlide);

          return () => {
            console.log('Cleaning up event listener');
            api.off('select', updateSlide);
          };
        } else {
          console.log('Carousel API not ready, retrying...');
        }
      } else {
        console.log('Carousel ref not ready, retrying...');
        // Try again if carousel isn't ready yet
        setTimeout(checkCarousel, 100);
      }
    };

    checkCarousel();
  }, []);


  return (
    <main className="min-h-screen min-w-screen relative">
      <Carousel ref={carouselRef} />
      <div className="fixed flex items-center justify-center top-0 left-0 w-screen h-[25vh] bg-transparent z-10">
        <h1 className="text-4xl text-white mt-2 text-center font-semibold flex bg-transparent justify-center items-center flex-col">
          Start your journey with{" "}
          <span className="bg-gradient-to-r h-24 from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
            {isLoading ? "Loading..." : (currentSlide?.title || "Ai Hoshino")}
          </span>
        </h1>
      </div>
      {/* Overlay elements */}
      {/* <div className="absolute top-8 left-8 bg-blue-500 p-4 rounded-lg shadow-lg z-10">
        <Image
          className="w-25 self-end"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 p-6 rounded-lg shadow-lg z-10">
        <span className="text-white text-xl font-semibold">Text</span>
      </div> */}

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevClick}
        className="fixed scale-150 left-4 top-1/2 transform -translate-y-1/2 z-[100] bg-black/20 hover:bg-black/40 active:bg-black/60 text-white border border-white/20 backdrop-blur-sm touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer rounded-md pointer-events-auto"
        type="button"
        style={{ marginTop: '25vh' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      <button
        onClick={handleNextClick}
        className="fixed scale-150 right-4 top-1/2 transform -translate-y-1/2 z-[100] bg-black/20 hover:bg-black/40 active:bg-black/60 text-white border border-white/20 backdrop-blur-sm touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer rounded-md pointer-events-auto"
        type="button"
        style={{ marginTop: '25vh' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

      <div className="fixed bottom-0 left-0 w-screen bg-transparent justify-center items-center p-4 z-10 flex">
        <Link href={`/chat?character=${encodeURIComponent(isLoading ? 'Ai Hoshino' : (currentSlide?.title || 'Ai Hoshino'))}`}>
          <Button className="w-24 scale-150 bg-red-500 hover:bg-red-600 text-white text-xl self-center">
            start
          </Button>
        </Link>
      </div>
    </main>
  );
}
