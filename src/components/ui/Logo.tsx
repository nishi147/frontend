import React from 'react';
import Image from 'next/image';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ruzann_logo.png"
        alt="Ruzann Logo"
        width={130}
        height={60}
        className="object-contain mix-blend-multiply"
        priority
      />
    </div>
  );
};



