import React, { useState } from 'react';
import { MessageCircle, User, Mail, Phone } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hola, mi nombre es ${formData.name}.\n\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje: ${formData.message}`;
    window.open(`https://wa.me/57954327446?text=${encodeURIComponent(text)}`, '_blank');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all";

  return (
    <section id="contacto" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm font-medium tracking-wider uppercase text-[#00bcd4] mb-4">Contáctanos</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a5f7a] mb-6">¿Listo para Encontrar tu Hogar?</h2>
            <p className="text-base md:text-lg text-slate-600 mb-8">Estamos aquí para ayudarte en cada paso del camino. Contáctanos a través de WhatsApp y un asesor te responderá de inmediato.</p>
            <div className="flex items-center gap-4">
              <div className="bg-[#9acd32] p-4 rounded-2xl"><MessageCircle className="text-white" size={32} /></div>
              <div><p className="text-sm text-slate-600">Escríbenos al WhatsApp</p><p className="text-xl font-bold text-[#1a5f7a]">+57 954 327 446</p></div>
            </div>
          </div>
          <div className="bg-[#f8fafc] rounded-3xl p-8 md:p-10 border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo *</label>
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" name="name" value={formData.name} onChange={handleChange} required className={`${inputClass} pl-12`} placeholder="Tu nombre" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico *</label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="email" name="email" value={formData.email} onChange={handleChange} required className={`${inputClass} pl-12`} placeholder="tu@email.com" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Teléfono *</label>
                <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={`${inputClass} pl-12`} placeholder="+57 300 123 4567" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Mensaje *</label><textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className={inputClass} placeholder="Cuéntanos qué tipo de propiedad estás buscando..." /></div>
              <button type="submit" className="w-full bg-[#9acd32] hover:bg-[#8bc34a] text-white rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">Enviar mensaje por WhatsApp</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
