import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ruzann_logo.png"
        alt="Ruzann Logo"
        width={180}
        height={80}
        className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
        priority
      />
    </div>
  );
};