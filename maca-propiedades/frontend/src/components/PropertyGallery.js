import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import { Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PropertyGallery = ({ onEdit }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      try {
        await axios.delete(`${API}/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        alert('Error al eliminar la propiedad');
      }
    }
  };

  const filtered = properties.filter(p => {
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchType && matchStatus;
  });

  const FilterBtn = ({ value, current, onClick, color = '#1a5f7a' }) => (
    <button onClick={onClick} className={`px-6 py-2.5 rounded-full font-medium transition-all ${current === value ? `text-white shadow-md` : 'bg-white text-slate-700 border border-slate-200'}`}
      style={current === value ? { backgroundColor: color } : {}}>{value === 'all' ? 'Todas' : value}</button>
  );

  return (
    <section id="propiedades" className="py-24 md:py-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-wider uppercase text-[#00bcd4] mb-4">Nuestras Propiedades</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a5f7a] mb-6">Encuentra Tu Propiedad Ideal</h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Explora nuestra selección de casas, apartamentos y terrenos disponibles para venta o arriendo</p>
        </div>
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-center flex-wrap">
          <div className="flex items-center gap-3"><Filter className="text-[#1a5f7a]" size={20} /><span className="font-medium text-slate-700">Tipo:</span></div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['all', 'Casa', 'Apartamento', 'Terreno'].map(v => <FilterBtn key={v} value={v} current={typeFilter} onClick={() => setTypeFilter(v)} color="#1a5f7a" />)}
          </div>
          <div className="h-8 w-px bg-slate-300 hidden md:block" />
          <div className="flex items-center gap-3"><span className="font-medium text-slate-700">Estado:</span></div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['all', 'Venta', 'Arriendo'].map(v => <FilterBtn key={v} value={v} current={statusFilter} onClick={() => setStatusFilter(v)} color="#00bcd4" />)}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-20"><div className="inline-block w-12 h-12 border-4 border-[#1a5f7a]/20 border-t-[#1a5f7a] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><p className="text-lg text-slate-600">No se encontraron propiedades con los filtros seleccionados.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filtered.map(property => <PropertyCard key={property.id} property={property} onEdit={onEdit} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyGallery;
