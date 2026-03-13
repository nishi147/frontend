import React from "react";
import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ruzann_logo.png"
        alt="Ruzann Logo"
        width={105}
        height={50}
        className="h-25 w-33 object-contain"
        priority
      />
    </div>
  );
};