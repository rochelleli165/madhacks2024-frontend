import React, { useEffect, useState } from 'react';
import './App.css'

const GifOverlay = ({ gifSrc, duration, onHide }) => {
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    const time = setTimeout(() => {
      setShowGif(false);
      if (onHide) onHide(); // Call the onHide callback when GIF disappears
    }, duration);

    return () => clearTimeout(time);
  }, [duration, onHide]);
  return (
    showGif && (
      <div className="gif-overlay">
        <img src={require(`${gifSrc}`)} alt="Overlay GIF" />
      </div>
    )
  );
};

export default GifOverlay;
