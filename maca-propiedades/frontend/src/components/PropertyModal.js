import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Bed, Bath, Car, Maximize2, Layers, Wind, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCY_SYMBOLS = { CLP: 'CLP', UF: 'UF', USD: 'USD' };

const PropertyModal = ({ property, onClose }) => {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const images = property?.image_urls?.length
    ? property.image_urls
    : (property?.image_url ? [property.image_url] : []);

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(images.length, 1)), [images.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)), [images.length]);

  useEffect(() => { setIndex(0); setZoomed(false); }, [property]);

  useEffect(() => {
    if (!property) return;
    const handler = (e) => {
      if (e.key === 'Escape') { zoomed ? setZoomed(false) : onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [property, zoomed, onClose]);

  useEffect(() => {
    if (property) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [property]);

  if (!property) return null;

  const currencySymbol = CURRENCY_SYMBOLS[property.currency] || '$';
  const priceDisplay = `${currencySymbol} ${property.price}`;
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
          {/* Backdrop con fade */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Modal con slide-up elegante */}
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
              {/* Línea decorativa superior */}
              <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #1a5f7a, #00bcd4, #9acd32)' }} />

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded-full shadow-sm z-20 transition"
              >
                <X size={18} className="text-slate-600" />
              </button>

              <div className="flex flex-col md:flex-row overflow-hidden flex-1 min-h-0">

                {/* IMÁGENES */}
                <div className="w-full md:w-[52%] flex-shrink-0 bg-slate-900 flex flex-col">
                  <div className="relative flex-1 min-h-0 overflow-hidden" style={{ minHeight: '220px', maxHeight: '420px' }}>
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[index]}
                          alt={property.title}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() => setZoomed(true)}
                        />
                        <button onClick={() => setZoomed(true)}
                          className="absolute bottom-3 left-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition">
                          <ZoomIn size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">Sin imágenes</div>
                    )}
                    {images.length > 1 && (
                      <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}/{images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-1.5 p-2 overflow-x-auto bg-black/85 flex-shrink-0">
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setIndex(i)} className="flex-shrink-0">
                          <img src={img}
                            className={`h-12 w-16 object-cover rounded-md transition border-2 ${i === index ? 'border-[#00bcd4] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                  <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                    <div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${property.status === 'Venta' ? 'bg-[#9acd32] text-white' : 'bg-[#00bcd4] text-white'}`}>
                          {property.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-[#1a5f7a]">
                          {property.type}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#1a5f7a] leading-tight mb-2">{property.title}</h2>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} className="text-[#00bcd4] flex-shrink-0" />
                        <span className="text-sm">{property.commune ? `${property.commune}, ` : ''}{property.region || property.location}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#1a5f7a]/5 to-[#00bcd4]/5 rounded-xl px-4 py-3 border border-[#1a5f7a]/10">
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Precio</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#1a5f7a]">{priceDisplay}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Características</p>
                      <div className="grid grid-cols-2 gap-2">
                        <InfoChip icon={Bed} label="Dormitorios" value={property.bedrooms} color="#1a5f7a" />
                        <InfoChip icon={Bath} label="Baños" value={property.bathrooms} color="#00bcd4" />
                        <InfoChip icon={Car} label="Estacionam." value={property.parking} color="#9acd32" />
                        <InfoChip icon={Maximize2} label="Área" value={property.area ? `${property.area} m²` : null} color="#f59e0b" />
                        <InfoChip icon={Layers} label="Pisos" value={property.floors} color="#8b5cf6" />
                        <InfoChip icon={Wind} label="Balcón" value={property.balcony !== undefined ? (property.balcony ? 'Sí' : 'No') : null} color="#06b6d4" />
                      </div>
                    </div>

                    {property.description && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Descripción</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 border-t border-slate-100 flex-shrink-0">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-xl font-semibold transition text-center shadow-sm hover:shadow-md">
                      Me interesa — WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LIGHTBOX */}
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
              onClick={() => setZoomed(false)}
            >
              <button onClick={() => setZoomed(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition">
                <X size={22} />
              </button>
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                    <ChevronLeft size={26} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
              <img src={images[index]} className="max-w-full max-h-full object-contain rounded-xl select-none" onClick={(e) => e.stopPropagation()} />
              <p className="absolute bottom-5 text-white/60 text-sm">{index + 1} / {images.length}</p>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
