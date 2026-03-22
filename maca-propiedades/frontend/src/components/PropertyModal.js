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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn">

      <div className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden relative shadow-2xl">

        {/* cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow z-10">
          <X />
        </button>

        {/* imagen principal */}
        <div className="relative h-[300px] md:h-[450px] bg-black">
          {images.length > 0 && (
            <img
              src={images[index]}
              className="w-full h-full object-cover transition duration-500 hover:scale-105"
            />
          )}

          {/* botones */}
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
        </div>

        {/* mini galería estilo airbnb */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setIndex(i)}
                className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 ${
                  i === index ? 'border-blue-500' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        )}

        {/* info */}
        <div className="p-6">

          <h2 className="text-2xl font-bold text-[#1a5f7a] mb-2">
            {property.title}
          </h2>

          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <MapPin size={16} />
            <span>{property.location}</span>
          </div>

          <div className="flex gap-6 mb-4">
            <span className="flex items-center gap-2">
              <Bed /> {property.bedrooms} hab
            </span>
            <span className="flex items-center gap-2">
              <Bath /> {property.bathrooms} baños
            </span>
          </div>

          <p className="text-xl font-bold mb-4">
            ${property.price}
          </p>

          <p className="text-gray-600 mb-6">
            {property.description || 'Sin descripción'}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Me interesa
          </a>

        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
