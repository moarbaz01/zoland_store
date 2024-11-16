// components/BoxBackground.tsx
import React from "react";
import "@/styles/boxAnimation.css";

const BoxBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary to-white overflow-hidden -z-20">
      {/* Animated Boxes */}
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default BoxBackground;
