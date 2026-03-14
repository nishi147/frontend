import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ruzann_logo.png"
        alt="Ruzann Logo"
        width={140}
        height={60}
        className="h-9 md:h-12 lg:h-14 w-auto object-contain"
        priority
      />
    </div>
  );
};