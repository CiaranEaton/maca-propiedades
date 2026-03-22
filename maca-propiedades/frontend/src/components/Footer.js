import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#1a5f7a] text-white py-16">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <img src="https://customer-assets.emergentagent.com/job_property-gallery-6/artifacts/65lwawjz_A%C3%B1adir%20un%20t%C3%ADtulo%20%281%29.png" alt="MACA Propiedades" className="h-20 w-auto mb-4" />
          <p className="text-white/80 leading-relaxed">Tu socio confiable en bienes raíces. Conectamos familias con sus hogares ideales.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Contacto</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><Phone size={18} /><span className="text-white/80">+57 954 327 446</span></div>
            <div className="flex items-center gap-3"><Mail size={18} /><span className="text-white/80">contacto@macapropiedades.com</span></div>
            <div className="flex items-center gap-3"><MapPin size={18} /><span className="text-white/80">Medellín, Colombia</span></div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
          <div className="flex gap-4">
            <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:-translate-y-1"><Facebook size={20} /></a>
            <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:-translate-y-1"><Instagram size={20} /></a>
            <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:-translate-y-1"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 pt-8 text-center">
        <p className="text-white/70">© {new Date().getFullYear()} MACA Propiedades. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
