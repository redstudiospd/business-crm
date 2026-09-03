"use client";

import React from "react";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-2">
      <span className="h-px w-4 bg-accent" />
      {children}
    </p>
  );
}

export default Eyebrow;
