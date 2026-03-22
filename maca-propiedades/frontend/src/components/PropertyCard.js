import React, { useState } from 'react';
import { Bed, Bath, MapPin, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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
      className="property-card cursor-pointer group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#00bcd4]/30 transition-all duration-500 shadow-md hover:shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
        
        {/* Imagen */}
        {images.length > 0 ? (
          <img 
            src={images[imgIndex]} 
            alt={property.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
            Sin imagen
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${
            property.status === 'Venta'
              ? 'bg-[#9acd32]/90 text-white'
              : 'bg-[#00bcd4]/90 text-white'
          }`}>
            {property.status}
          </span>

          <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md bg-white/90 text-[#1a5f7a]">
            {property.type}
          </span>
        </div>

        {/* Admin buttons (IMPORTANTE: stopPropagation) */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              title="Editar"
              className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-md"
            >
              <Edit className="text-[#1a5f7a]" size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
              title="Eliminar"
              className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-md"
            >
              <Trash2 className="text-red-500" size={18} />
            </button>
          </div>
        )}

        {/* Carrusel */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIndex(i => Math.max(0, i - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIndex(i => Math.min(images.length - 1, i + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full"
            >
              <ChevronRight size={18} />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIndex(i);
                  }}
                  className={`h-1.5 rounded-full ${
                    i === imgIndex ? 'bg-white w-5' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
              {imgIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#1a5f7a] mb-2">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <MapPin size={15} />
          <span className="text-sm">
            {property.commune ? `${property.commune}, ` : ''}
            {property.region || property.location}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bed className="text-[#00bcd4]" size={20} />
            <span className="text-slate-700 font-medium">
              {property.bedrooms}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Bath className="text-[#00bcd4]" size={20} />
            <span className="text-slate-700 font-medium">
              {property.bathrooms}
            </span>
          </div>
        </div>

        <p className="text-2xl font-bold text-[#1a5f7a]">
          {priceDisplay}
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
