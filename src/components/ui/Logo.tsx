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
        className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
        priority
      />
    </div>
  );
};