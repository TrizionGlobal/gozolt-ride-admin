'use client';

interface RewardFieldRowProps {
  label: string;
  value: number;
  unit: string;
  step?: string;
  isEditing: boolean;
  onChange: (value: number) => void;
}

export function RewardFieldRow({
  label,
  value,
  unit,
  step = '1',
  isEditing,
  onChange,
}: RewardFieldRowProps) {
  const formatValue = (val: number) => {
    if (unit === '€') return val.toFixed(2);
    return val.toLocaleString();
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A2A]/50 last:border-b-0">
      <span className="text-sm text-[#9CA3AF]">{label}</span>
      <div className="flex items-center gap-1.5">
        {isEditing ? (
          <>
            <input
              type="number"
              step={step}
              min="0"
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-xs text-[#6B7280] w-10">{unit}</span>
          </>
        ) : (
          <span className="text-sm font-medium text-white">
            {unit === '€' ? (
              <>€{formatValue(value)} <span className="text-[#6B7280]">{unit}</span></>
            ) : (
              <>
                {formatValue(value)}{' '}
                <span className="text-[#6B7280]">{unit}</span>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
