import React, { useState } from "react";
import "../CSS/FlipLogo.css";

export default function FlipLogo({ theme = "light" }) {
  const [hover, setHover] = useState(false);

  return (
    <div className="flip-logo-outer">
      <div
        className={`flip-logo-inner ${hover ? "hovered" : ""} ${
          theme === "light" ? "light" : "dark"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Ön yüz */}
        <div className="flip-logo-front">DijitalKart</div>

        {/* Arka yüz */}
        <div className="flip-logo-back">Göster Kendini :)</div>
      </div>
    </div>
  );
}
