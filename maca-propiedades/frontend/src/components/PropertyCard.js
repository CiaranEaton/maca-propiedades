import React, { useState } from 'react';
import { Bed, Bath, MapPin, Edit, Trash2, ChevronLeft, ChevronRight, Images } from 'lucide-react';

const CURRENCY_SYMBOLS = { CLP: '$', UF: 'UF', USD: 'USD' };

const PropertyCard = ({ property, onEdit, onDelete, isAdmin, onClick }) => {
  const images = property.image_urls?.length
    ? property.image_urls
    : (property.image_url ? [property.image_url] : []);

  const [imgIndex, setImgIndex] = useState(0);
  const currencySymbol = CURRENCY_SYMBOLS[property.currency] || '$';
  const priceDisplay = `${currencySymbol} ${property.price}`;

  return (
    <div
      onClick={() => onClick(property)}
      className="cursor-pointer group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#00bcd4]/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col"
    >
      {/* Imagen — altura fija siempre */}
      <div className="relative w-full h-52 bg-slate-200 flex-shrink-0 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[imgIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Images size={32} />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}

        {/* Overlay degradado sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow ${
            property.status === 'Venta' ? 'bg-[#9acd32] text-white' : 'bg-[#00bcd4] text-white'
          }`}>
            {property.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/90 text-[#1a5f7a] shadow">
            {property.type}
          </span>
        </div>

        {/* Botones admin */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(property); }}
              className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-all">
              <Edit className="text-[#1a5f7a]" size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(property.id); }}
              className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-all">
              <Trash2 className="text-red-500" size={15} />
            </button>
          </div>
        )}

        {/* Carrusel */}
        {images.length > 1 && (
          <>
            <button type="button"
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition">
              <ChevronLeft size={16} />
            </button>
            <button type="button"
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition">
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {imgIndex + 1}/{images.length}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button key={i} type="button"
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                  className={`h-1 rounded-full transition-all ${i === imgIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-semibold text-[#1a5f7a] leading-tight line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin size={13} className="flex-shrink-0" />
          <span className="text-xs truncate">
            {property.commune ? `${property.commune}, ` : ''}{property.region || property.location}
          </span>
        </div>

        <div className="flex items-center gap-4 py-2 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5">
            <Bed className="text-[#00bcd4]" size={16} />
            <span className="text-sm text-slate-600 font-medium">{property.bedrooms} hab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="text-[#00bcd4]" size={16} />
            <span className="text-sm text-slate-600 font-medium">{property.bathrooms} baños</span>
          </div>
        </div>

        <p className="text-xl font-bold text-[#1a5f7a]">{priceDisplay}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
