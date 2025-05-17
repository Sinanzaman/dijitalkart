import React, { useState } from "react";

export default function FlipLogo({ theme = "light" }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        perspective: "600px",
        width: "100%",
        height: 50,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          fontSize: 24,
          color: "#0a66c2",
          cursor: "pointer",
          userSelect: "none",
          borderRadius: 8,
          boxShadow:
            theme === "light"
              ? "0 2px 8px rgba(0,0,0,0.1)"
              : "0 2px 8px rgba(255,255,255,0.2)",
          backgroundColor: theme === "light" ? "white" : "#222",
          padding: "0 10px",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: hover ? "rotateY(180deg)" : "rotateY(0deg)",
          boxSizing: "border-box",
        }}
      >
        {/* Ön yüz */}
        <div
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          DijitalKart
        </div>

        {/* Arka yüz */}
        <div
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            width: "100%",
            height: "100%",
            color: "white",
            background:
              "linear-gradient(45deg, #ff0057, #ff8a00, #40e0d0, #ff0057)",
            backgroundSize: "400% 400%",
            animation: hover ? "colorShift 2s ease infinite" : "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "700",
            fontSize: 18,
            transform: "rotateY(180deg)",
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          Göster Kendini :)
        </div>

        <style>
          {`
            @keyframes colorShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
