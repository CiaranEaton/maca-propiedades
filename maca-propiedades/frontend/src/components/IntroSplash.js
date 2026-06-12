import React, { useState, useEffect } from 'react';

const LOGO = "https://res.cloudinary.com/dixpqiaki/image/upload/v1774240529/21077156-80c5-424e-99bc-f9526a6f0026-removebg-preview_ldizx0.png";

/**
 * Intro animada: el logo aparece grande al centro (~1s) y vuela a la
 * esquina superior izquierda, donde queda el logo del header. Se desmonta solo.
 */
const IntroSplash = () => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Si el usuario prefiere menos movimiento, saltamos la intro.
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDone(true); return; }
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 44%, #f1fbff, #ffffff 72%)',
        animation: 'maca-splash 1.9s ease forwards',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <img
        src={LOGO}
        alt="MACA Propiedades"
        style={{
          height: '64px', width: 'auto',
          animation: 'maca-splashLogo 1.9s cubic-bezier(.66,0,.24,1) forwards',
        }}
      />
    </div>
  );
};

export default IntroSplash;
