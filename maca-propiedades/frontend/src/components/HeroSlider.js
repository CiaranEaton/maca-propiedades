import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { url: 'https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?crop=entropy&cs=srgb&fm=jpg&q=85', title: 'Tu Hogar Ideal Te Espera', subtitle: 'Encuentra la propiedad perfecta con MACA Propiedades' },
  { url: 'https://images.pexels.com/photos/17174768/pexels-photo-17174768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', title: 'Inversiones Inteligentes', subtitle: 'Las mejores oportunidades del mercado inmobiliario' },
  { url: 'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=srgb&fm=jpg&q=85', title: 'Calidad y Confianza', subtitle: 'Más de 10 años conectando familias con sus sueños' }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}   // ← más rápido (antes 1s)
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].url})` }}
          />
          {/* Overlay más oscuro para que el texto se lea bien */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, delay: 0.1 }}  // ← más rápido
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-2xl text-white mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
                {slides[currentSlide].subtitle}
              </p>
              <a
                href="#propiedades"
                className="inline-block bg-[#9acd32] hover:bg-[#8bc34a] text-white rounded-full px-10 py-4 font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Explorar Propiedades
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full p-3 transition-all"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>
      <button
        onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full p-3 transition-all"
      >
        <ChevronRight className="text-white" size={28} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'bg-white w-16' : 'bg-white/40 w-12 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
