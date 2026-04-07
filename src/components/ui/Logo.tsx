"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  const [processedSrc, setProcessedSrc] = useState<string>("/ruzann_logo_new_v3.png");

  useEffect(() => {
    const removeBackground = async () => {
      const img = new (window.Image)();
      img.crossOrigin = "anonymous";
      img.src = "/ruzann_logo_new_v3.png";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Loop through pixels and make white/near-white transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          // Detect pure white or very close to white
          if (r > 245 && g > 245 && b > 245) {
            data[i+3] = 0; // Set Alpha to 0
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedSrc(canvas.toDataURL());
      };
    };

    removeBackground();
  }, []);

  return (
    <div className={`flex items-center h-full ${className}`}>
      <div className="relative w-48 sm:w-64 lg:w-72 h-full flex items-center justify-center transition-all duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={processedSrc}
          alt="Ruzann logo"
          className="w-full h-full object-contain transition-transform"
        />
      </div>
    </div>
  );
};