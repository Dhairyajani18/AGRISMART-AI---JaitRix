import React from 'react';

interface ConfidenceMeterProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: 'circular' | 'bar';
  colorOverride?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  variant = 'circular',
  colorOverride,
}) => {
  const normalizedValue = Math.min(100, Math.max(0, percentage));

  // Determine color based on confidence level
  const getColor = () => {
    if (colorOverride) return colorOverride;
    if (normalizedValue >= 85) return '#16834A'; // Primary Green
    if (normalizedValue >= 60) return '#F59E0B'; // Warning Amber
    return '#DC2626'; // Danger Red
  };

  const color = getColor();

  if (variant === 'bar') {
    return (
      <div className="w-full space-y-1.5" role="meter" aria-valuenow={normalizedValue} aria-valuemin={0} aria-valuemax={100}>
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-[#17211B]">{label || 'Confidence Level'}</span>
          <span style={{ color }} className="font-mono font-bold text-base">
            {normalizedValue}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${normalizedValue}%`,
              backgroundColor: color,
            }}
          />
        </div>
        {sublabel && <p className="text-xs text-[#66736B]">{sublabel}</p>}
      </div>
    );
  }

  // Circular gauge calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center" role="meter" aria-valuenow={normalizedValue} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-70"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center percentage readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-[#0D3B2A] font-mono leading-none">
            {normalizedValue}%
          </span>
          {sublabel ? (
            <span className="text-[10px] uppercase font-bold text-[#66736B] tracking-wider mt-1">
              {sublabel}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold text-[#66736B] tracking-wider mt-1">
              Match
            </span>
          )}
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-[#17211B]">{label}</span>}
    </div>
  );
};
