import React, { useState, useEffect, useCallback } from 'react';
import { Bed, Bath, MapPin, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const CURRENCY_SYMBOLS = { CLP: '$', UF: 'UF', USD: 'USD' };

const PropertyModal = ({ property, onClose }) => {
  if (!property) return null;

  const images = property.image_urls?.length
    ? property.image_urls
    : (property.image_url ? [property.image_url] : []);

  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') zoomed ? setZoomed(false) : onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoomed, onClose]);

  // Bloquear scroll — limpieza robusta para evitar congelamiento
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.body.style.removeProperty('overflow');
    };
  }, []);

  const currencySymbol = CURRENCY_SYMBOLS[property.currency] || '$';
  const priceDisplay = `${currencySymbol} ${property.price}`;
  const whatsappUrl = `https://wa.me/56954327446?text=${encodeURIComponent(
    `Hola, me interesa la propiedad: ${property.title} en ${property.location || property.region || ''}`
  )}`;

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 md:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-20 transition"
          >
            <X size={20} />
          </button>

          {/* LAYOUT: stack en móvil, lado a lado en desktop */}
          <div className="flex flex-col md:flex-row overflow-auto md:overflow-hidden flex-1 min-h-0">

            {/* BLOQUE IMAGEN */}
            <div className="relative w-full md:w-1/2 flex-shrink-0 bg-black flex flex-col">

              {/* Imagen principal — altura fija */}
              <div className="relative h-56 sm:h-64 md:h-full min-h-0 flex-1 overflow-hidden">
                {images.length > 0 && (
                  <>
                    <img
                      src={images[index]}
                      alt={property.title}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setZoomed(true)}
                    />
                    <button
                      onClick={() => setZoomed(true)}
                      className="absolute bottom-3 left-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition"
                      title="Ver en grande"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </>
                )}

                {/* Navegación */}
                {images.length > 1 && (
                  <>
                    <button onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/{images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-2 overflow-x-auto bg-black/80 flex-shrink-0">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setIndex(i)} className="flex-shrink-0">
                      <img
                        src={img}
                        className={`h-14 w-20 object-cover rounded-lg transition border-2 ${
                          i === index ? 'border-[#00bcd4]' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BLOQUE INFO */}
            <div className="flex flex-col justify-between p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
              <div className="flex flex-col gap-3">

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    property.status === 'Venta' ? 'bg-[#9acd32] text-white' : 'bg-[#00bcd4] text-white'
                  }`}>
                    {property.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-[#1a5f7a]">
                    {property.type}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-[#1a5f7a] leading-tight">
                  {property.title}
                </h2>

                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={15} />
                  <span className="text-sm">
                    {property.commune ? `${property.commune}, ` : ''}
                    {property.region || property.location}
                  </span>
                </div>

                <div className="flex gap-5 py-3 border-y border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bed className="text-[#00bcd4]" size={18} />
                    <span className="text-sm font-medium text-slate-700">{property.bedrooms} habitaciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="text-[#00bcd4]" size={18} />
                    <span className="text-sm font-medium text-slate-700">{property.bathrooms} baños</span>
                  </div>
                </div>

                <p className="text-2xl md:text-3xl font-bold text-[#1a5f7a]">{priceDisplay}</p>

                {property.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
                )}
              </div>

              {/* Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition text-center"
              >
                Me interesa
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                <ChevronLeft size={28} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <img
            src={images[index]}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/70 text-sm">{index + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
};

export default PropertyModal;
