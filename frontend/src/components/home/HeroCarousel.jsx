import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import carouselService from '../../services/carouselService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await carouselService.getActiveSlides();
        setSlides(data);
      } catch (error) {
        console.error("Failed to load slides", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) return null; // O un skeleton loader si se prefiere
  if (slides.length === 0) return null;

  return (
    <div className="w-full h-[80vh] md:h-[90vh] relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={slide.imagen_url}
              alt={slide.titulo}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: `center ${slide.position_y}%` }}
            />

            {/* Content Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-20 text-white">
              <h2 className="text-sm md:text-lg tracking-[0.2em] uppercase mb-4 animate-fade-in-up">
                {slide.subtitulo}
              </h2>
              <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 animate-fade-in-up delay-100 max-w-4xl leading-tight">
                {slide.titulo}
              </h1>
              
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-white/10 !backdrop-blur-sm !rounded-full hover:!bg-white/20 transition-all opacity-0 group-hover:opacity-100 after:!text-lg"></div>
        <div className="swiper-button-next !text-white !w-12 !h-12 !bg-white/10 !backdrop-blur-sm !rounded-full hover:!bg-white/20 transition-all opacity-0 group-hover:opacity-100 after:!text-lg"></div>
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
