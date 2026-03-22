import React, { useState } from 'react';
import "./App.css";
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import PropertyGallery from './components/PropertyGallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';

function App() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <div className="App">
      <Header onAdminClick={() => handleOpenAdminModal()} />
      <HeroSlider />
      <PropertyGallery key={refreshKey} onEdit={handleOpenAdminModal} />
      <ContactForm />
      <Footer />
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
