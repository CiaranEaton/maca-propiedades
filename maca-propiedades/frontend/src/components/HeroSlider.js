import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';

// Mismas imágenes del hero actual (cross-fade con zoom lento "Ken Burns").
const slides = [
  'https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?crop=entropy&cs=srgb&fm=jpg&q=85',
  'https://images.pexels.com/photos/17174768/pexels-photo-17174768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=srgb&fm=jpg&q=85',
];

// Contador animado (0 → target) con easing. Re-anima si cambia el target
// (p. ej. cuando llegan las propiedades reales del backend).
const StatItem = ({ stat }) => {
  const [val, setVal] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const target = Number(stat.target) || 0;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target === 0) { setVal(target); return; }
    let t0;
    const duration = 1200;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stat.target]);

  return (
    <div className="text-center">
      <div className="font-bold text-3xl md:text-4xl text-white leading-none drop-shadow"
        style={{ textShadow: '0 2px 12px rgba(0,0,0,.3)' }}>
        {stat.prefix}{val}{stat.suffix}
      </div>
      <div className="text-xs md:text-sm font-medium text-white/80 mt-1.5 tracking-wide">{stat.label}</div>
    </div>
  );
};

const fieldClass =
  "flex-1 min-w-[150px] flex flex-col items-start bg-[#f4f7f6] rounded-xl px-3.5 py-2 text-left";
const labelClass =
  "text-[10px] font-bold tracking-wide text-slate-400 uppercase";
const selectClass =
  "w-full bg-transparent border-none outline-none text-[15px] font-semibold text-[#15323a] mt-0.5 cursor-pointer";

const HeroSlider = ({
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
  communeFilter, setCommuneFilter,
  communes = [],
  stats = [],
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="top"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0d3d52' }}
    >
      {/* Slider de fondo con zoom lento */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((url, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center maca-kenburns"
            style={{
              backgroundImage: `url(${url})`,
              opacity: i === current ? 1 : 0,
              transform: i === current ? 'scale(1.12)' : 'scale(1)',
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(5,22,28,.72) 0%, rgba(5,22,28,.42) 40%, rgba(5,22,28,.84) 100%)' }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-24 text-center">
        <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm text-white font-medium text-xs md:text-sm tracking-wide px-4 py-2 rounded-full">
          <MapPin size={14} className="text-[#9acd32]" />
          Inmobiliaria en Chillán, Región de Ñuble
        </span>

        <h1 className="mt-6 font-bold text-white leading-[1.03] tracking-tight drop-shadow-lg"
          style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)', textShadow: '0 4px 34px rgba(0,0,0,.4)' }}>
          Tu Hogar Ideal<br />Te Espera
        </h1>
        <p className="mt-5 mx-auto max-w-xl text-white/90 drop-shadow"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.3rem)' }}>
          Encuentra la propiedad perfecta con MACA Propiedades
        </p>

        {/* Buscador rápido — filtra de verdad la galería */}
        <div className="mt-9 mx-auto max-w-3xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-3.5 flex flex-wrap gap-2.5 items-stretch">
          <label className={fieldClass}>
            <span className={labelClass}>Operación</span>
            <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todas</option>
              <option value="Venta">Venta</option>
              <option value="Arriendo">Arriendo</option>
            </select>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Tipo</span>
            <select className={selectClass} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno">Terreno</option>
            </select>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Comuna</span>
            <select className={selectClass} value={communeFilter} onChange={(e) => setCommuneFilter(e.target.value)}>
              <option value="all">Todas</option>
              {communes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <a
            href="#propiedades"
            className="flex items-center justify-center gap-2 text-[#0e4a50] font-bold text-[15px] px-7 py-3 sm:py-0 w-full sm:w-auto rounded-xl transition-transform hover:-translate-y-0.5"
            style={{ background: '#9acd32', boxShadow: '0 6px 16px rgba(154,205,50,.4)' }}
          >
            <Search size={18} />
            Buscar
          </a>
        </div>

        {/* Contadores */}
        {stats.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6 md:gap-x-16">
            {stats.map((s, i) => <StatItem key={i} stat={s} />)}
          </div>
        )}
      </div>

      {/* Indicadores de slide */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Imagen ${i + 1}`}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === current ? '30px' : '9px',
              background: i === current ? '#9acd32' : 'rgba(255,255,255,.5)',
            }}
          />
        ))}
      </div>

      {/* Flecha scroll */}
      <a href="#propiedades" aria-label="Bajar" className="maca-bob absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-white/75">
        <ChevronDown size={26} />
      </a>
    </section>
  );
};

export default HeroSlider;
