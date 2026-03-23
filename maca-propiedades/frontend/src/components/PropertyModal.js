import React, { useState } from 'react';
import { Bed, Bath, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyModal = ({ property, onClose }) => {
  if (!property) return null;

  const images = property.image_urls?.length
    ? property.image_urls
    : (property.image_url ? [property.image_url] : []);

  const [index, setIndex] = useState(0);

  const next = () => setIndex(i => (i + 1) % images.length);
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);

  const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(
    `Hola, me interesa la propiedad ${property.title} en ${property.location}`
  )}`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl relative animate-fadeIn">

        {/* Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow z-10">
          <X />
        </button>

        {/* GRID PRINCIPAL */}
        <div className="grid md:grid-cols-2 gap-0">

          {/* IMÁGENES */}
          <div className="bg-black relative">

            {/* Imagen principal */}
            {images.length > 0 && (
              <img
                src={images[index]}
                className="w-full h-[300px] md:h-full object-cover transition duration-500 hover:scale-105"
              />
            )}

            {/* Navegación */}
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 bg-black/50 text-white p-2 rounded-full">
                  <ChevronLeft />
                </button>

                <button onClick={next} className="absolute right-3 top-1/2 bg-black/50 text-white p-2 rounded-full">
                  <ChevronRight />
                </button>
              </>
            )}

            {/* Contador */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded">
              {index + 1}/{images.length}
            </div>
          </div>

          {/* INFO */}
          <div className="p-6 flex flex-col justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#1a5f7a] mb-2">
                {property.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span>{property.location}</span>
              </div>

              {/* características */}
              <div className="flex gap-6 mb-4">
                <span className="flex items-center gap-2">
                  <Bed /> {property.bedrooms} hab
                </span>

                <span className="flex items-center gap-2">
                  <Bath /> {property.bathrooms} baños
                </span>
              </div>

              <p className="text-2xl font-bold text-[#1a5f7a] mb-4">
                ${property.price}
              </p>

              <p className="text-gray-600 leading-relaxed">
                {property.description || 'Sin descripción'}
              </p>
            </div>

            {/* BOTÓN WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-center font-semibold transition"
            >
              Me interesa
            </a>
          </div>
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto border-t">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setIndex(i)}
                className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 transition ${
                  i === index ? 'border-[#00bcd4]' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PropertyModal;
