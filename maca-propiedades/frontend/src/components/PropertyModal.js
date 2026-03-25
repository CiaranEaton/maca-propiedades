import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize2, Layers, MapPin, Star, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCY_SYMBOLS = { CLP: '$', UF: 'UF', USD: 'USD' };

const renderMarkdown = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const listMatch = line.match(/^(\s*)([-*•]|✅|☑️|✔️|📍|🏠|🚗|💰|⭐|🌟|❌|👉|📌)\s+(.+)/u);
    if (listMatch) return (
      <div key={i} className="flex items-start gap-2 py-0.5">
        <span className="flex-shrink-0 mt-0.5">{listMatch[2]}</span>
        <span dangerouslySetInnerHTML={{ __html: formatInline(listMatch[3]) }} />
      </div>
    );
    return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
  });
};

const formatInline = (text) => text
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');

const PropertyModal = ({ property, onClose }) => {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Ref para leer zoomed dentro de callbacks sin que quede stale
  const zoomedRef = useRef(false);
  useEffect(() => { zoomedRef.current = zoomed; }, [zoomed]);

  // Refs para swipe en imagen principal
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchMoved = useRef(false);

  // Refs para swipe en lightbox
  const lbTouchStartX = useRef(null);

  const images = property?.image_urls?.length
    ? property.image_urls
    : (property?.image_url ? [property.image_url] : []);

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(images.length, 1)), [images.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)), [images.length]);

  useEffect(() => { setIndex(0); setZoomed(false); }, [property]);

  // Escape key
  useEffect(() => {
    if (!property) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (zoomedRef.current) setZoomed(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [property, onClose]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = property ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [property]);

  // Historial del navegador (botón atrás cierra modal)
  // ─────────────────────────────────────────────────────────────────────────
  // BUG RAÍZ CORREGIDO: "zoomed" NO debe estar en las dependencias.
  // Antes, cada vez que setZoomed(true) cambiaba el estado, React ejecutaba
  // el cleanup del efecto, que llamaba window.history.back(), disparando
  // popstate → onClose(). El zoom abría y cerraba en el mismo ciclo de render.
  // Solución: usar zoomedRef (siempre actualizado) dentro del callback,
  // sin agregar zoomed como dependencia del efecto.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!property) return;
    window.history.pushState({ modal: true }, '');
    const handlePopState = () => {
      if (zoomedRef.current) {
        setZoomed(false);
        window.history.pushState({ modal: true }, '');
      } else {
        onClose();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modal) window.history.back();
    };
  }, [property, onClose]); // ← zoomed eliminado de dependencias ✅

  // ── Touch handlers para área de imagen ───────────────────────────────────
  const onImgTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
  };

  const onImgTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 8 || dy > 8) touchMoved.current = true;
  };

  const onImgTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const wasMoved = touchMoved.current;
    touchStartX.current = null;
    touchStartY.current = null;
    touchMoved.current = false;

    if (wasMoved && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault(); // mata el ghost click en swipe
      if (dx < 0) next(); else prev();
    }
    // Tap limpio → el browser genera click → onClick abre zoom ✅
  };

  // ── Touch handlers para lightbox ─────────────────────────────────────────
  const onLbTouchStart = (e) => { lbTouchStartX.current = e.touches[0].clientX; };
  const onLbTouchEnd = (e) => {
    if (lbTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
    lbTouchStartX.current = null;
    if (Math.abs(dx) > 50) {
      e.preventDefault();
      if (dx < 0) next(); else prev();
    }
  };

  if (!property) return null;

  const currencySymbol = CURRENCY_SYMBOLS[property.currency] || '$';
  const priceDisplay = `${currencySymbol} ${property.price}`;
  const originalPriceDisplay = property.original_price
    ? `${currencySymbol} ${property.original_price}` : null;

  const whatsappUrl = `https://wa.me/56954327446?text=${encodeURIComponent(
    `Hola, me interesa la propiedad: ${property.title} en ${property.commune ? property.commune + ', ' : ''}${property.region || property.location || ''}`
  )}`;

  const InfoChip = ({ icon: Icon, label, value, color = '#00bcd4' }) => (
    value !== undefined && value !== null && value !== '' && value !== 0 ? (
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
        <Icon size={16} style={{ color }} className="flex-shrink-0" />
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-slate-700 leading-none">{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <AnimatePresence>
      {property && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 pointer-events-none"
          >
            <div
              className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col relative pointer-events-auto"
              style={{ maxHeight: '92vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full flex-shrink-0"
                style={{ background: 'linear-gradient(90deg, #1a5f7a, #00bcd4, #9acd32)' }} />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded-full shadow-sm z-20 transition"
              >
                <X size={18} className="text-slate-600" />
              </button>

              <div className="flex flex-col md:flex-row overflow-hidden flex-1 min-h-0">

                {/* ── PANEL DE IMÁGENES ────────────────────────────────── */}
                <div className="w-full md:w-[52%] flex-shrink-0 bg-slate-900 flex flex-col">

                  {/* Área de imagen */}
                  <div
                    className="relative overflow-hidden flex-1"
                    style={{ aspectRatio: '16/10', minHeight: '200px' }}
                  >
                    {images.length > 0 ? (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={index}
                            src={images[index]}
                            alt={property.title}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 w-full h-full object-contain bg-slate-900"
                            draggable={false}
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          />
                        </AnimatePresence>

                        {/* Botón invisible de zoom + swipe — z-[5] */}
                        <button
                          className="absolute inset-0 w-full h-full z-[5]"
                          style={{ cursor: 'zoom-in', background: 'transparent', border: 'none' }}
                          onClick={() => setZoomed(true)}
                          onTouchStart={onImgTouchStart}
                          onTouchMove={onImgTouchMove}
                          onTouchEnd={onImgTouchEnd}
                          aria-label="Ampliar imagen"
                        />

                        {/* Botones de navegación — z-10 */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prev(); }}
                              className="absolute left-0 top-0 bottom-0 w-12 z-10 flex items-center justify-center"
                              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.40), transparent)' }}
                              aria-label="Imagen anterior"
                            >
                              <ChevronLeft size={24} className="text-white drop-shadow" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); next(); }}
                              className="absolute right-0 top-0 bottom-0 w-12 z-10 flex items-center justify-center"
                              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.40), transparent)' }}
                              aria-label="Imagen siguiente"
                            >
                              <ChevronRight size={24} className="text-white drop-shadow" />
                            </button>
                            <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10 pointer-events-none">
                              {index + 1}/{images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        Sin imágenes
                      </div>
                    )}
                  </div>

                  {/* Hint sutil debajo de la imagen */}
                  {images.length > 0 && (
                    <p className="text-center text-[10px] text-slate-400 py-1 bg-slate-900 tracking-wide select-none">
                      click para aumentar
                    </p>
                  )}

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-1.5 p-2 overflow-x-auto bg-black/85 flex-shrink-0">
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setIndex(i)} className="flex-shrink-0">
                          <img
                            src={img}
                            alt=""
                            className={`h-12 w-16 object-cover rounded-md transition border-2 ${i === index ? 'border-[#00bcd4] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── PANEL DE INFORMACIÓN ─────────────────────────────── */}
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                  <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">

                    {(property.featured || property.on_offer) && (
                      <div className="flex gap-2 flex-wrap">
                        {property.featured && (
                          <div className="flex items-center gap-1.5 bg-[#1a5f7a] text-white px-3 py-1.5 rounded-full">
                            <Star size={12} fill="white" />
                            <span className="text-xs font-bold uppercase tracking-wide">Destacada</span>
                          </div>
                        )}
                        {property.on_offer && (
                          <div className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #9acd32, #7cb342)' }}>
                            <Tag size={12} />
                            <span className="text-xs font-bold uppercase tracking-wide">En oferta</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${property.status === 'Venta' ? 'bg-[#9acd32] text-white' : 'bg-[#00bcd4] text-white'}`}>
                          {property.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-[#1a5f7a]">
                          {property.type}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#1a5f7a] leading-tight mb-2">
                        {property.title}
                      </h2>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} className="text-[#00bcd4] flex-shrink-0" />
                        <span className="text-sm">
                          {property.commune ? `${property.commune}, ` : ''}
                          {property.region || property.location}
                        </span>
                      </div>
                    </div>

                    <div className={`rounded-xl px-4 py-3 border ${property.on_offer
                      ? 'bg-gradient-to-r from-[#9acd32]/10 to-[#7cb342]/5 border-[#9acd32]/30'
                      : 'bg-gradient-to-r from-[#1a5f7a]/5 to-[#00bcd4]/5 border-[#1a5f7a]/10'}`}>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Precio</p>
                      {property.on_offer && originalPriceDisplay && (
                        <p className="text-base text-slate-400 line-through mb-0.5">{originalPriceDisplay}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className={`text-2xl md:text-3xl font-bold ${property.on_offer ? 'text-[#7cb342]' : 'text-[#1a5f7a]'}`}>
                          {priceDisplay}
                        </p>
                        {property.on_offer && originalPriceDisplay && (
                          <span className="bg-[#9acd32] text-white text-xs font-bold px-3 py-1 rounded-full">OFERTA</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Características</p>
                      <div className="grid grid-cols-2 gap-2">
                        <InfoChip icon={Bed} label="Dormitorios" value={property.bedrooms} color="#1a5f7a" />
                        <InfoChip icon={Bath} label="Baños" value={property.bathrooms} color="#00bcd4" />
                        <InfoChip icon={Car} label="Estacionam." value={property.parking} color="#9acd32" />
                        <InfoChip icon={Maximize2} label="M² construidos"
                          value={property.area_built ? `${property.area_built} m²` : (property.area ? `${property.area} m²` : null)}
                          color="#f59e0b" />
                        <InfoChip icon={Maximize2} label="M² totales"
                          value={property.area_total ? `${property.area_total} m²` : null}
                          color="#10b981" />
                        <InfoChip icon={Layers} label="Pisos" value={property.floors} color="#8b5cf6" />
                      </div>
                    </div>

                    {property.description && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Descripción</p>
                        <div className="text-sm text-slate-600 leading-relaxed">
                          {renderMarkdown(property.description)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 border-t border-slate-100 flex-shrink-0">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-xl font-semibold transition text-center shadow-sm hover:shadow-md"
                    >
                      Me interesa — WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── LIGHTBOX ────────────────────────────────────────────────── */}
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
              onClick={() => setZoomed(false)}
              onTouchStart={onLbTouchStart}
              onTouchEnd={onLbTouchEnd}
            >
              <button
                onClick={() => setZoomed(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition z-10"
              >
                <X size={22} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-start pl-3 z-10"
                  >
                    <span className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                      <ChevronLeft size={26} />
                    </span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-end pr-3 z-10"
                  >
                    <span className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                      <ChevronRight size={26} />
                    </span>
                  </button>
                </>
              )}

              <img
                src={images[index]}
                alt={property.title}
                className="max-w-full max-h-full object-contain rounded-xl select-none"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />

              <p className="absolute bottom-5 text-white/60 text-sm pointer-events-none">
                {index + 1} / {images.length}
              </p>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
