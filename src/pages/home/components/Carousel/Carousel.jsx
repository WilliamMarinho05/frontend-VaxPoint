import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

function Carousel({ campanhas = [] }) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (campanhas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === campanhas.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [campanhas]);

  const nextBanner = () => {
    if (campanhas.length === 0) return;
    setCurrentBanner((prev) => (prev === campanhas.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = () => {
    if (campanhas.length === 0) return;
    setCurrentBanner((prev) => (prev === 0 ? campanhas.length - 1 : prev - 1));
  };

  const getPosition = (index) => {
    const diff = index - currentBanner;
    if (diff === 0) return 'active';
    if (diff === 1 || diff === -2) return 'right';
    return 'left';
  };

  if (campanhas.length === 0) {
    return <div className="carousel-empty">Nenhuma campanha disponível.</div>;
  }

  return (
    <div className="home-carousel">
      <button onClick={prevBanner} className="carousel-btn-arrow left">
        <ChevronLeft size={36} color="#fff" />
      </button>

      <div className="carousel-viewport">
        <div className="carousel-track">
          {campanhas.map((campanha, index) => (
            <div key={campanha.id} className={`carousel-slide ${getPosition(index)}`}>
              <img src={campanha.imagem_url} className="carousel-image" alt={campanha.titulo} />
              <div className="carousel-info">
                <h3>{campanha.titulo}</h3>
                <p>{campanha.publico}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={nextBanner} className="carousel-btn-arrow right">
        <ChevronRight size={36} color="#fff" />
      </button>
    </div>
  );
}

export default Carousel;