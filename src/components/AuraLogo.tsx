import React from 'react';

export function AuraEmblem({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center justify-center font-serif italic font-semibold select-none ${className}`}>
      A
    </span>
  );
}

export function AuraLogoBadge() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-neutral-950 text-white shadow-md shadow-neutral-950/20 group-hover:scale-105 transition-transform duration-300">
      <span className="font-serif italic font-normal text-xl leading-none text-white">
        A
      </span>
    </div>
  );
}

