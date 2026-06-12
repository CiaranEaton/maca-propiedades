import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import { Filter, SearchX } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PropertyGallery = ({
  onEdit,
  isAdmin,
  typeFilter = 'all', setTypeFilter,
  statusFilter = 'all', setStatusFilter,
  communeFilter = 'all', setCommuneFilter,
  onData,
  onClearFilters,
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
      onData?.(response.data);
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
        const next = properties.filter(p => p.id !== id);
        setProperties(next);
        onData?.(next);
      } catch (error) {
        alert('Error al eliminar la propiedad');
      }
    }
  };

  const filtered = properties.filter(p => {
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchCommune = communeFilter === 'all' || p.commune === communeFilter;
    return matchType && matchStatus && matchCommune;
  });

  const hasActiveFilters = typeFilter !== 'all' || statusFilter !== 'all' || communeFilter !== 'all';
  const clear = () => {
    if (onClearFilters) { onClearFilters(); return; }
    setTypeFilter?.('all');
    setStatusFilter?.('all');
    setCommuneFilter?.('all');
  };

  const resultLabel = `${filtered.length} ${filtered.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}`;

  const FilterBtn = ({ value, current, onClick, color }) => (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm hover:-translate-y-0.5 ${
        current === value ? 'text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#1a5f7a]'
      }`}
      style={current === value ? { backgroundColor: color } : {}}
    >
      {value === 'all' ? 'Todas' : value}
    </button>
  );

  return (
    <section id="propiedades" className="relative py-24 bg-[#f8fafc] overflow-hidden scroll-mt-24">

      {/* Logo marca de agua de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <img
          src="https://res.cloudinary.com/dixpqiaki/image/upload/v1774240529/21077156-80c5-424e-99bc-f9526a6f0026-removebg-preview_ldizx0.png"
          alt=""
          className="w-[600px] md:w-[800px] opacity-[0.035] object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-wider uppercase text-[#00bcd4] mb-3">Nuestras Propiedades</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a5f7a] mb-4">Encuentra Tu Propiedad Ideal</h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">Explora nuestra selección de casas, apartamentos y terrenos disponibles para venta o arriendo</p>
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="text-[#1a5f7a]" size={18} />
            <span className="font-medium text-slate-700 text-sm">Tipo:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'Casa', 'Apartamento', 'Terreno'].map(v => (
              <FilterBtn key={v} value={v} current={typeFilter} onClick={() => setTypeFilter?.(v)} color="#1a5f7a" />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-300 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700 text-sm">Estado:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'Venta', 'Arriendo'].map(v => (
              <FilterBtn key={v} value={v} current={statusFilter} onClick={() => setStatusFilter?.(v)} color="#00bcd4" />
            ))}
          </div>
        </div>

        {/* Contador de resultados / filtro de comuna activo */}
        {!loading && (
          <div className="text-center text-sm text-slate-500 mb-10 flex items-center justify-center gap-3 flex-wrap">
            <span>{resultLabel}</span>
            {communeFilter !== 'all' && (
              <button
                onClick={() => setCommuneFilter?.('all')}
                className="inline-flex items-center gap-1 text-[#1a5f7a] bg-[#1a5f7a]/10 hover:bg-[#1a5f7a]/15 rounded-full px-3 py-1 font-medium transition"
              >
                {communeFilter} ✕
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#1a5f7a]/20 border-t-[#1a5f7a] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <SearchX className="mx-auto text-slate-300 mb-3" size={56} />
            <p className="text-lg font-semibold text-slate-600">No encontramos propiedades con esos filtros</p>
            {hasActiveFilters && (
              <button onClick={clear} className="mt-3 text-[#1a5f7a] font-semibold hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onEdit={onEdit}
                onDelete={handleDelete}
                isAdmin={isAdmin}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
};

export default PropertyGallery;
