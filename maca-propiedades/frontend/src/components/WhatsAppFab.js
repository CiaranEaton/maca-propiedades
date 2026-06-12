import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP = "https://wa.me/56954327446?text=" + encodeURIComponent(
  "Hola MACA Propiedades, me gustaría recibir más información."
);

/** Botón flotante de WhatsApp con pulso (esquina inferior derecha). */
const WhatsAppFab = () => (
  <a
    href={WHATSAPP}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escríbenos por WhatsApp"
    className="maca-pulse fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
    style={{ background: '#25D366' }}
  >
    <MessageCircle className="text-white" size={28} />
  </a>
);

export default WhatsAppFab;
