'use client';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'footer';
  spin?: boolean;
  showRing?: boolean;
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  footer: 'w-5 h-5',
};

export function Logo3D({ size = 'md', spin = true, showRing = true, className = '' }: Logo3DProps) {
  const img = (
    <div
      className={`${sizeMap[size]} ${spin ? 'animate-spin-slow' : ''} rounded-full overflow-hidden`}
    >
      <img
        src="/logo-atlas-core.png"
        alt="Atlas Core"
        className={`w-full h-full object-cover ${className}`}
        draggable={false}
      />
    </div>
  );

  if (size === 'footer') {
    return (
      <div className="rounded-full overflow-hidden">
        <img
          src="/logo-atlas-core.png"
          alt="Atlas Core"
          className="w-5 h-5 rounded-full overflow-hidden object-cover"
          draggable={false}
        />
      </div>
    );
  }

  if (showRing) {
    return (
      <div className="relative flex items-center justify-center">
        {img}
        <div
          className="absolute inset-[-4px] rounded-full border border-[#00D4AA]/30 animate-pulse"
          style={{ animationDuration: '3s' }}
        />
      </div>
    );
  }

  return img;
}
