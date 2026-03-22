import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const emptyForm = { title: '', type: 'Casa', status: 'Venta', price: '', bedrooms: 0, bathrooms: 0, location: '', image_url: '', description: '' };

const AdminModal = ({ isOpen, onClose, editProperty, onSuccess }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(editProperty ? { ...emptyForm, ...editProperty } : emptyForm);
  }, [editProperty, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: (name === 'bedrooms' || name === 'bathrooms') ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editProperty) { await axios.put(`${API}/properties/${editProperty.id}`, formData); }
      else { await axios.post(`${API}/properties`, formData); }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error al guardar la propiedad');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1a5f7a]">{editProperty ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="text-slate-600" size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Título *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Ej: Casa Campestre en las Colinas" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Tipo *</label>
              <select name="type" value={formData.type} onChange={handleChange} required className={inputClass}>
                <option value="Casa">Casa</option><option value="Apartamento">Apartamento</option><option value="Terreno">Terreno</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Estado *</label>
              <select name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
                <option value="Venta">Venta</option><option value="Arriendo">Arriendo</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Precio *</label><input type="text" name="price" value={formData.price} onChange={handleChange} required className={inputClass} placeholder="Ej: $450,000,000 o $2,500,000/mes" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Habitaciones *</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-2">Baños *</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" className={inputClass} /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Ubicación *</label><input type="text" name="location" value={formData.location} onChange={handleChange} required className={inputClass} placeholder="Ej: Medellín, Antioquia" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">URL de Imagen *</label><input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required className={inputClass} placeholder="https://ejemplo.com/imagen.jpg" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass} placeholder="Descripción adicional..." /></div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={submitting} className="flex-1 px-6 py-3 bg-[#1a5f7a] hover:bg-[#134e66] text-white rounded-full font-medium transition-all disabled:opacity-50">{submitting ? 'Guardando...' : editProperty ? 'Actualizar' : 'Crear Propiedad'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
