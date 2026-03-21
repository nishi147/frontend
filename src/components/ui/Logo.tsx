import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-48 sm:w-64 lg:w-72 h-32 sm:h-40 lg:h-44 overflow-hidden flex items-center justify-center bg-white/50 rounded-2xl">
        <Image
          src="/ruzann_logo.png"
          alt="Ruzann logo"
          width={600}
          height={600}
          className="w-full h-full object-contain scale-[2.2] translate-y-[-2%] transition-transform"
          priority
        />
      </div>
    </div>
  );
};