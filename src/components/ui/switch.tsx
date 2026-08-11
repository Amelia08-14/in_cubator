"use client";

import React, { useState } from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked = false, onCheckedChange, className = "" }: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(checked);
  
  const isChecked = onCheckedChange ? checked : internalChecked;

  const toggle = () => {
    if (onCheckedChange) {
      onCheckedChange(!isChecked);
    } else {
      setInternalChecked(!isChecked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isChecked ? 'bg-[#47295C]' : 'bg-gray-200'
      } ${className}`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
