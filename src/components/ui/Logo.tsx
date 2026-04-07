import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center h-full ${className}`}>
      <div className="relative w-48 sm:w-64 lg:w-72 h-full flex items-center justify-center transition-all duration-300">
        <Image
          src="/ruzann_logo-removebg-preview.png"
          alt="Ruzann logo"
          width={1200}
          height={400}
          className="w-full h-full object-contain transition-transform"
          priority
        />
      </div>
    </div>
  );
};