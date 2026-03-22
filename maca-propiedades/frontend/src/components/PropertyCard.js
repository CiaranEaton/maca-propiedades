import React from 'react';
import { Bed, Bath, MapPin, Edit, Trash2 } from 'lucide-react';

const PropertyCard = ({ property, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="property-card group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#00bcd4]/30 transition-all duration-500 shadow-md hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={property.image_url} alt={property.title} className="property-card-image w-full h-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${property.status === 'Venta' ? 'bg-[#9acd32]/90 text-white' : 'bg-[#00bcd4]/90 text-white'}`}>{property.status}</span>
          <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md bg-white/90 text-[#1a5f7a]">{property.type}</span>
        </div>
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => onEdit(property)} title="Editar" className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-md"><Edit className="text-[#1a5f7a]" size={18} /></button>
            <button onClick={() => onDelete(property.id)} title="Eliminar" className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-md"><Trash2 className="text-red-500" size={18} /></button>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-medium text-[#1a5f7a] mb-3">{property.title}</h3>
        <div className="flex items-center gap-2 text-slate-600 mb-4"><MapPin size={16} /><span className="text-sm">{property.location}</span></div>
        <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2"><Bed className="text-[#00bcd4]" size={20} /><span className="text-slate-700 font-medium">{property.bedrooms}</span></div>
          <div className="flex items-center gap-2"><Bath className="text-[#00bcd4]" size={20} /><span className="text-slate-700 font-medium">{property.bathrooms}</span></div>
        </div>
        <p className="text-3xl font-bold text-[#1a5f7a]">{property.price}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
