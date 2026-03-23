import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 
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
 
      {/* Fondo con transición */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
        </motion.div>
      </AnimatePresence>
 
      {/* Contenido central */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
 
        {/* Título y subtítulo — cambian con la transición */}
        <div className="mb-10" style={{ minHeight: '180px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-5 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-2xl text-white font-medium drop-shadow-md max-w-2xl mx-auto">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
 
        {/* Botón ESTÁTICO — no forma parte de la animación */}
        <a
          href="#propiedades"
          className="inline-block bg-[#9acd32] hover:bg-[#8bc34a] text-white rounded-full px-10 py-4 font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
        >
          Explorar Propiedades
        </a>
      </div>
 
      {/* Indicadores de slide — sin botones de navegación */}
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
