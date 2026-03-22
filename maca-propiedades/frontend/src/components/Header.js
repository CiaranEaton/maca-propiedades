import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img src="https://customer-assets.emergentagent.com/job_property-gallery-6/artifacts/65lwawjz_A%C3%B1adir%20un%20t%C3%ADtulo%20%281%29.png" alt="MACA Propiedades" className="h-16 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#propiedades" className={`font-medium transition-colors hover:text-[#1a5f7a] ${scrolled ? 'text-slate-700' : 'text-white'}`}>Propiedades</a>
            <a href="#contacto" className={`font-medium transition-colors hover:text-[#1a5f7a] ${scrolled ? 'text-slate-700' : 'text-white'}`}>Contacto</a>
            <button onClick={onAdminClick} className="bg-[#1a5f7a] hover:bg-[#134e66] text-white rounded-full px-6 py-3 font-medium transition-all hover:-translate-y-0.5">Admin</button>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className={scrolled ? 'text-slate-700' : 'text-white'} size={28} /> : <Menu className={scrolled ? 'text-slate-700' : 'text-white'} size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 flex flex-col gap-4 pb-4 bg-white rounded-2xl p-4 mt-4">
            <a href="#propiedades" onClick={() => setMobileMenuOpen(false)} className="font-medium text-slate-700 hover:text-[#1a5f7a]">Propiedades</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="font-medium text-slate-700 hover:text-[#1a5f7a]">Contacto</a>
            <button onClick={() => { onAdminClick(); setMobileMenuOpen(false); }} className="bg-[#1a5f7a] text-white rounded-full px-6 py-3 font-medium text-left">Admin</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
