"use client";

import React from "react";
import { Square, Grid2x2, Grid3x3 } from "lucide-react";

interface OptionProps {
  cols: 1 | 2 | 3;
  onColsChange: (cols: 1 | 2 | 3) => void;
}

const options: { cols: 1 | 2 | 3; icon: React.ReactElement }[] = [
  { cols: 1, icon: <Square size={16} /> },
  { cols: 2, icon: <Grid2x2 size={16} /> },
  { cols: 3, icon: <Grid3x3 size={16} /> },
];

export function Option({ cols, onColsChange }: OptionProps) {
  return (
    <div className="flex gap-1 justify-end">
      {options.map(({ cols: n, icon }) => (
        <button
          key={n}
          onClick={() => onColsChange(n)}
          className={`flex items-center justify-center p-2 rounded-md border transition-colors ${
            cols === n
              ? "bg-foreground text-background border-foreground"
              : "text-muted-foreground border-border hover:bg-muted"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
