import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize2, Layers, MapPin, Star, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCY_SYMBOLS = { CLP: '$', UF: 'UF', USD: 'USD' };

const renderMarkdown = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const listMatch = line.match(/^(\s*)([-*•]|✅|☑️|✔️|📍|🏠|🚗|💰|⭐|🌟|❌|👉|📌)\s+(.+)/u);
    if (listMatch) return (
      <div key={i} className="flex items-start gap-2 py-0.5">
        <span className="flex-shrink-0 mt-0.5">{listMatch[2]}</span>
        <span dangerouslySetInnerHTML={{ __html: formatInline(listMatch[3]) }} />
      </div>
    );
    return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
  });
};

const formatInline = (text) => text
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');

const PropertyModal = ({ property, onClose }) => {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const zoomedRef = useRef(false);
  useEffect(() => { zoomedRef.current = zoomed; }, [zoomed]);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchMoved = useRef(false);

  const lbTouchStartX = useRef(null);

  const images = property?.image_urls?.length
    ? property.image_urls
    : (property?.image_url ? [property.image_url] : []);

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(images.length, 1)), [images.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)), [images.length]);

  useEffect(() => { setIndex(0); setZoomed(false); }, [property]);

  useEffect(() => {
    if (!property) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (zoomedRef.current) setZoomed(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [property, onClose]);

  useEffect(() => {
    document.body.style.overflow = property ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [property]);

  useEffect(() => {
    if (!property) return;
    window.history.pushState({ modal: true }, '');
    const handlePopState = () => {
      if (zoomedRef.current) {
        setZoomed(false);
        window.history.pushState({ modal: true }, '');
      } else {
        onClose();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modal) window.history.back();
    };
  }, [property, onClose]);

  const onImgTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
  };

  const onImgTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 8 || dy > 8) touchMoved.current = true;
  };

  const onImgTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const wasMoved = touchMoved.current;
    touchStartX.current = null;
    touchStartY.current = null;
    touchMoved.current = false;

    if (wasMoved && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      if (dx < 0) next(); else prev();
    }
  };

  const onLbTouchStart = (e) => { lbTouchStartX.current = e.touches[0].clientX; };
  const onLbTouchEnd = (e) => {
    if (lbTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
    lbTouchStartX.current = null;
    if (Math.abs(dx) > 50) {
      e.preventDefault();
      if (dx < 0) next(); else prev();
    }
  };

  if (!property) return null;

  return (
    <AnimatePresence>
      {property && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
            onTouchStart={onLbTouchStart}
            onTouchEnd={onLbTouchEnd}
          >
            {/* BOTÓN CORREGIDO */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomed(false);
              }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition z-[100]"
            >
              <X size={22} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-start pl-3 z-[90]"
                >
                  <span className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                    <ChevronLeft size={26} />
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-end pr-3 z-[90]"
                >
                  <span className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition">
                    <ChevronRight size={26} />
                  </span>
                </button>
              </>
            )}

            <img
              src={images[index]}
              alt=""
              className="relative z-0 max-w-full max-h-full object-contain rounded-xl select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            <p className="absolute bottom-5 text-white/60 text-sm pointer-events-none">
              {index + 1} / {images.length}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
