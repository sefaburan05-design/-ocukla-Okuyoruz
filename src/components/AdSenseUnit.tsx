import React, { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ 
  slot = "8194377456", 
  format = "auto", 
  className = "",
  label = "Sponsorlu İçerik"
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && adRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore if AdSense script is blocked or already pushed
    }
  }, [slot]);

  return (
    <div className={`my-4 p-3 bg-slate-50/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center space-y-1.5 print:hidden ${className}`}>
      <div className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
        <span>— {label} —</span>
      </div>
      
      <div className="min-h-[90px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200/60 dark:border-slate-800 shadow-xs overflow-hidden relative">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client="ca-pub-8194377456854810"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

