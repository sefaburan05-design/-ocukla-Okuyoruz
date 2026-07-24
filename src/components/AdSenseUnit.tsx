import React, { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // Initialize Google AdSense unit
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Catch initialization if blocked by preview sandbox
    }
  }, [slot]);

  return (
    <div className={`my-4 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1.5 print:hidden ${className}`}>
      <div className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
        <span>— {label} —</span>
      </div>
      
      <div className="min-h-[60px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200/60 dark:border-slate-800 shadow-xs overflow-hidden">
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8194377456854810"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
