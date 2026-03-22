import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const CLOUDINARY_CLOUD = 'dixpqiaki';
const CLOUDINARY_PRESET = 'maca_propiedades';

const REGIONES_COMUNAS = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Cabildo", "Calera", "Hijuelas", "La Cruz", "Nogales", "Quillota", "San Esteban", "Putaendo", "San Felipe", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
  "Metropolitana de Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
  "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
  "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
  "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Los Ríos": ["Valdivia", "Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

const CURRENCIES = [
  { value: 'CLP', label: 'Peso chileno ($)', symbol: '$', placeholder: '85.000.000' },
  { value: 'UF', label: 'Unidad de Fomento (UF)', symbol: 'UF', placeholder: '3.500' },
  { value: 'USD', label: 'Dólar estadounidense (USD)', symbol: 'USD', placeholder: '95.000' },
];

const emptyForm = {
  title: '', type: 'Casa', status: 'Venta',
  currency: 'CLP', price: '',
  bedrooms: 1, bathrooms: 1,
  region: '', commune: '',
  image_urls: [], description: ''
};

const formatNumber = (val) => {
  const digits = val.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const AdminModal = ({ isOpen, onClose, editProperty, onSuccess }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editProperty) {
      const urls = editProperty.image_urls?.length ? editProperty.image_urls : (editProperty.image_url ? [editProperty.image_url] : []);
      setFormData({ ...emptyForm, ...editProperty, image_urls: urls });
    } else {
      setFormData(emptyForm);
    }
    setCurrentImageIndex(0);
  }, [editProperty, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'bedrooms' || name === 'bathrooms') ? parseInt(value) || 0 : value,
      ...(name === 'region' ? { commune: '' } : {})
    }));
  };

  const handlePriceChange = (e) => {
    const formatted = formatNumber(e.target.value);
    setFormData(prev => ({ ...prev, price: formatted }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.image_urls.length + files.length > 12) {
      alert('Máximo 12 fotos por propiedad.');
      return;
    }
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: data });
        const result = await res.json();
        if (result.secure_url) uploadedUrls.push(result.secure_url);
      }
      setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ...uploadedUrls] }));
    } catch (error) {
      alert('Error al subir imágenes. Verifica tu conexión.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const updated = prev.image_urls.filter((_, i) => i !== index);
      return { ...prev, image_urls: updated };
    });
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_urls.length) {
      alert('Por favor sube al menos una foto de la propiedad.');
      return;
    }
    if (!formData.region) {
      alert('Por favor selecciona una región.');
      return;
    }
    setSubmitting(true);
    const payload = {
      ...formData,
      image_url: formData.image_urls[0],
      location: `${formData.commune ? formData.commune + ', ' : ''}${formData.region}, Chile`
    };
    try {
      if (editProperty) {
        await axios.put(`${API}/properties/${editProperty.id}`, payload);
      } else {
        await axios.post(`${API}/properties`, payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error al guardar la propiedad. Revisa tu conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all bg-white";
  const selectedCurrency = CURRENCIES.find(c => c.value === formData.currency) || CURRENCIES[0];
  const comunas = formData.region ? REGIONES_COMUNAS[formData.region] || [] : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-semibold text-[#1a5f7a]">{editProperty ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="text-slate-600" size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* === GALERÍA DE IMÁGENES === */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fotos de la propiedad * <span className="text-slate-400 font-normal">({formData.image_urls.length}/12 — mín. 1, máx. 12)</span>
            </label>

            {formData.image_urls.length > 0 && (
              <div className="relative mb-3 rounded-2xl overflow-hidden bg-slate-100" style={{height: '220px'}}>
                <img src={formData.image_urls[currentImageIndex]} alt={`Foto ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(currentImageIndex)} className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all">
                  <Trash2 size={16} />
                </button>
                {formData.image_urls.length > 1 && (
                  <>
                    <button type="button" onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all">
                      <ChevronLeft size={20} />
                    </button>
                    <button type="button" onClick={() => setCurrentImageIndex(i => Math.min(formData.image_urls.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all">
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {formData.image_urls.map((_, i) => (
                        <button key={i} type="button" onClick={() => setCurrentImageIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-5' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {formData.image_urls.length}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-3">
              {formData.image_urls.map((url, i) => (
                <div key={i} onClick={() => setCurrentImageIndex(i)} className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${i === currentImageIndex ? 'border-[#1a5f7a]' : 'border-transparent'}`}>
                  <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {formData.image_urls.length < 12 && (
                <div onClick={() => fileInputRef.current.click()} className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#1a5f7a] rounded-xl aspect-square flex flex-col items-center justify-center transition-colors text-slate-400 hover:text-[#1a5f7a]">
                  {uploading ? <div className="w-6 h-6 border-2 border-[#1a5f7a]/30 border-t-[#1a5f7a] rounded-full animate-spin" /> : <><Image size={24} /><span className="text-xs mt-1">Agregar</span></>}
                </div>
              )}
            </div>

            <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading || formData.image_urls.length >= 12}
              className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#1a5f7a] rounded-xl text-slate-500 hover:text-[#1a5f7a] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-40">
              <Upload size={18} />
              {uploading ? 'Subiendo...' : `Subir fotos desde el computador (puedes seleccionar varias)`}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </div>

          {/* === TÍTULO === */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Título *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Ej: Casa con jardín en Las Condes" />
          </div>

          {/* === TIPO Y ESTADO === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo *</label>
              <select name="type" value={formData.type} onChange={handleChange} required className={inputClass}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Departamento</option>
                <option value="Terreno">Terreno</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado *</label>
              <select name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
                <option value="Venta">Venta</option>
                <option value="Arriendo">Arriendo</option>
              </select>
            </div>
          </div>

          {/* === PRECIO CON MONEDA === */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Precio *</label>
            <div className="flex gap-3">
              <select name="currency" value={formData.currency} onChange={handleChange} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] outline-none bg-white font-medium text-[#1a5f7a] min-w-[110px]">
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.symbol}</option>)}
              </select>
              <input type="text" name="price" value={formData.price} onChange={handlePriceChange} required className={inputClass} placeholder={selectedCurrency.placeholder} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Los puntos se agregan automáticamente como separador de miles</p>
          </div>

          {/* === HABITACIONES Y BAÑOS === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Habitaciones *</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Baños *</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" className={inputClass} />
            </div>
          </div>

          {/* === REGIÓN Y COMUNA === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Región *</label>
              <select name="region" value={formData.region} onChange={handleChange} required className={inputClass}>
                <option value="">Selecciona una región</option>
                {Object.keys(REGIONES_COMUNAS).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Comuna</label>
              <select name="commune" value={formData.commune} onChange={handleChange} className={inputClass} disabled={!formData.region}>
                <option value="">{formData.region ? 'Selecciona una comuna' : 'Primero elige la región'}</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* === DESCRIPCIÓN === */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={inputClass} placeholder="Describe las características de la propiedad..." />
          </div>

          {/* === BOTONES === */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={submitting || uploading} className="flex-1 px-6 py-3 bg-[#1a5f7a] hover:bg-[#134e66] text-white rounded-full font-medium transition-all disabled:opacity-50">
              {submitting ? 'Guardando...' : editProperty ? 'Actualizar' : 'Crear Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
