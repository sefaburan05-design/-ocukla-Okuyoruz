import React, { useEffect, useRef, useState } from 'react';

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
  label = "Google AdSense"
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [isDevEnv, setIsDevEnv] = useState(false);

  useEffect(() => {
    // Check if running in development or preview domain
    const hostname = window.location.hostname;
    const isLocalOrPreview = hostname === 'localhost' || hostname.includes('run.app') || hostname.includes('127.0.0.1');
    setIsDevEnv(isLocalOrPreview);

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
      
      <div className="min-h-[120px] flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 rounded-xl p-2 border border-slate-200/60 dark:border-slate-800 shadow-xs overflow-hidden relative group">
        
        {/* Placeholder info shown in preview / dev environments when AdSense cannot serve live ads */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none z-0 opacity-80 group-hover:opacity-100 transition">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs mb-1">
            📢
          </div>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            Google AdSense Reklam Alanı
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-[200px]">
            {isDevEnv 
              ? 'Önizleme adresinde test modundadır. Canlı alan adınızda (domain) gerçek reklamlar görünecektir.'
              : 'Reklam yükleniyor...'}
          </span>
        </div>

        {/* AdSense ins tag */}
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center relative z-10"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client="ca-pub-8194377456854810"
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-test={isDevEnv ? "on" : undefined}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};


