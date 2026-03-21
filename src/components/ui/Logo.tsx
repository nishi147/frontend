import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-40 sm:w-52 lg:w-64 h-20 sm:h-24 lg:h-28 overflow-hidden flex items-center justify-center rounded-2xl">
        <Image
          src="/ruzann_logo.png"
          alt="Ruzann logo"
          width={500}
          height={500}
          className="w-full h-full object-contain scale-[1.7] translate-y-[-2%] transition-transform"
          priority
        />
      </div>
    </div>
  );
};