"use client";

import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  formatValue,
  className = "",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-default-700">{label}</label>
          <span className="text-sm text-default-600">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-default-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #006FEE 0%, #006FEE ${percentage}%, #e4e4e7 ${percentage}%, #e4e4e7 100%)`
          }}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #006FEE;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #006FEE;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
};