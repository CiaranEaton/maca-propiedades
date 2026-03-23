import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="relative text-white py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d3d52 0%, #1a5f7a 50%, #0d3d52 100%)' }}>
    
    {/* Logo marca de agua de fondo */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <img
        src="https://res.cloudinary.com/dixpqiaki/image/upload/v1774240529/21077156-80c5-424e-99bc-f9526a6f0026-removebg-preview_ldizx0.png"
        alt=""
        className="w-[500px] opacity-[0.04] object-contain"
      />
    </div>

    {/* Línea superior decorativa */}
    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #9acd32, #00bcd4, #9acd32)' }} />

    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

        {/* Columna logo */}
        <div className="flex flex-col items-start gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <img
              src="https://res.cloudinary.com/dixpqiaki/image/upload/v1774240529/21077156-80c5-424e-99bc-f9526a6f0026-removebg-preview_ldizx0.png"
              alt="MACA Propiedades"
              className="h-24 w-auto object-contain"
            />
          </div>
          <p className="text-white/70 leading-relaxed text-sm">
            Somos tu solución habitacional
          </p>
        </div>

        {/* Columna contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-[#9acd32] inline-block" />
            Contacto
          </h3>
          <div className="space-y-4">
            <a href="tel:+56954327446" className="flex items-center gap-3 text-white/75 hover:text-white transition group">
              <div className="bg-[#9acd32]/20 group-hover:bg-[#9acd32]/40 p-2 rounded-lg transition">
                <Phone size={16} className="text-[#9acd32]" />
              </div>
              <span className="text-sm">+56 954 327 446</span>
            </a>
            <a href="tel:+56945358545" className="flex items-center gap-3 text-white/75 hover:text-white transition group">
              <div className="bg-[#9acd32]/20 group-hover:bg-[#9acd32]/40 p-2 rounded-lg transition">
                <Phone size={16} className="text-[#9acd32]" />
              </div>
              <span className="text-sm">+56 945 358 545</span>
            </a>
            <a href="mailto:macapropiedades.2@gmail.com" className="flex items-center gap-3 text-white/75 hover:text-white transition group">
              <div className="bg-[#00bcd4]/20 group-hover:bg-[#00bcd4]/40 p-2 rounded-lg transition">
                <Mail size={16} className="text-[#00bcd4]" />
              </div>
              <span className="text-sm">macapropiedades.2@gmail.com</span>
            </a>
            <div className="flex items-center gap-3 text-white/75">
              <div className="bg-white/10 p-2 rounded-lg">
                <MapPin size={16} className="text-white/60" />
              </div>
              <span className="text-sm">Chillán, Chile</span>
            </div>
          </div>
        </div>

        {/* Columna redes */}
        <div>
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-[#00bcd4] inline-block" />
            Síguenos
          </h3>
          <div className="flex gap-3 mb-6">
            <a href="#" className="bg-white/10 hover:bg-[#1877f2]/80 p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-white/10 hover:bg-gradient-to-br hover:from-[#f09433] hover:to-[#e6683c] p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-white/10 hover:bg-black/60 p-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg">
              <Twitter size={20} />
            </a>
          </div>
          <a
            href="https://wa.me/56954327446"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Phone size={16} />
            WhatsApp directo
          </a>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} MACA Propiedades. Todos los derechos reservados.
        </p>
        <p className="text-white/30 text-xs">Chillán, Chile</p>
      </div>
    </div>
  </footer>
);

export default Footer;
