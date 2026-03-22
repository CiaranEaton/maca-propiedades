import React, { useState } from 'react';
import "./App.css";
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import PropertyGallery from './components/PropertyGallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';

const ADMIN_PASSWORD = "maca2026";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      setEditProperty(null);
      setIsAdminModalOpen(true);
    } else {
      setShowPasswordPrompt(true);
      setPasswordInput('');
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
      setEditProperty(null);
      setIsAdminModalOpen(true);
    } else {
      setPasswordError(true);
    }
  };

  const handleOpenAdminModal = (property = null) => {
    setEditProperty(property);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setEditProperty(null);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="App">
      <Header onAdminClick={handleAdminClick} isAdmin={isAdmin} onLogout={handleLogout} />
      <HeroSlider />
      <PropertyGallery key={refreshKey} onEdit={handleOpenAdminModal} isAdmin={isAdmin} />
      <ContactForm />
      <Footer />

      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-[#1a5f7a] mb-2">Acceso Administrador</h2>
            <p className="text-slate-500 text-sm mb-6">Ingresa la contraseña para continuar</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Contraseña"
                autoFocus
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none"
              />
              {passwordError && (
                <p className="text-red-500 text-sm">Contraseña incorrecta. Intenta de nuevo.</p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordPrompt(false)} className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#1a5f7a] hover:bg-[#134e66] text-white rounded-full font-medium transition-all">Entrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        editProperty={editProperty}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default App;
