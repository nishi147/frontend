import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ruzann_logo.png"
        alt="Ruzann Logo"
        width={250}
        height={100}
        className="h-16 sm:h-22 lg:h-28 w-auto object-contain"
        priority
      />
    </div>
  );
};