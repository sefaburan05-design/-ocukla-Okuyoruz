import React from 'react';
import { BookOpen, PenTool, Library, MessageSquare, Sparkles, Moon, Sun, Heart } from 'lucide-react';

interface HeaderProps {
  activeTab: 'create' | 'library' | 'reader' | 'about';
  setActiveTab: (tab: 'create' | 'library' | 'reader' | 'about') => void;
  siteTheme: 'light' | 'dark';
  onToggleSiteTheme: () => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  siteTheme, 
  onToggleSiteTheme,
  onOpenFeedback
}) => {
  const isReading = activeTab === 'reader';

  return (
    <header className={`backdrop-blur-md border-b shadow-xs sticky top-0 z-30 transition-all duration-300 ${
      siteTheme === 'dark' 
        ? 'bg-slate-900/95 border-slate-800 text-white' 
        : 'bg-white/95 border-purple-100/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-5">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('create')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 w-full sm:w-auto justify-between sm:justify-start"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Whimsical Magic Book & Star Logo */}
            <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-md shadow-purple-200 dark:shadow-none group-hover:scale-105 transition duration-300 shrink-0 w-10 h-10 sm:w-12 sm:h-12">
              <div className="w-full h-full bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-pink-500/30 to-amber-400/20" />
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 relative z-10" />
                <Sparkles className="w-2.5 h-2.5 text-white absolute top-0.5 right-0.5 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className={`font-black tracking-tight group-hover:text-purple-500 transition leading-tight ${
                  isReading 
                    ? 'text-sm sm:text-xl' 
                    : 'text-base sm:text-2xl'
                } ${siteTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Çocukla Okuyoruz
                </h1>
                <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-black rounded-full uppercase tracking-wider text-[9px] sm:text-[10px] px-2 py-0.5">
                  Seçki
                </span>
              </div>
              
              {/* Tagline / Subtitle */}
              <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium block mt-0.5">
                Çocuklarımız İçin Kişiselleştirilmiş Masal, Hikaye ve Şiir Portalı
              </p>
            </div>
          </div>

          {/* Quick Mobile Theme Button */}
          <button
            onClick={onToggleSiteTheme}
            className={`sm:hidden p-2 rounded-xl border transition flex items-center justify-center text-xs font-bold cursor-pointer shrink-0 shadow-xs ${
              siteTheme === 'dark'
                ? 'bg-white text-slate-950 border-slate-200 hover:bg-slate-100'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
            title={siteTheme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            {siteTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
            )}
          </button>
        </div>

        {/* Navigation & Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <nav className={`flex items-center gap-0.5 p-1 rounded-xl sm:rounded-2xl border shrink-0 ${
            siteTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100/80 border-slate-200/60'
          }`}>
            <button
              onClick={() => setActiveTab('create')}
              className={`rounded-lg sm:rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : siteTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Oluştur</span>
              <span className="hidden sm:inline">Eser Oluştur</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`rounded-lg sm:rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm ${
                activeTab === 'library' || activeTab === 'reader'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : siteTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Kütüphane</span>
              <span className="hidden sm:inline">Okuma Kütüphanesi</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`rounded-lg sm:rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm ${
                activeTab === 'about'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : siteTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span>Amacımız</span>
            </button>
          </nav>

          {/* Feedback & Contact Trigger */}
          <button
            onClick={onOpenFeedback}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl sm:rounded-2xl font-extrabold flex items-center gap-1 shadow-xs transition cursor-pointer shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs"
            title="Sefa Buran'a Görüş veya İstek Bildir"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Görüş & İletişim 💬</span>
            <span className="sm:hidden text-[11px]">İletişim 💬</span>
          </button>

          {/* Theme Switcher Button with High Contrast Colors */}
          <button
            onClick={onToggleSiteTheme}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl border transition text-xs font-black cursor-pointer shrink-0 shadow-xs ${
              siteTheme === 'dark'
                ? 'bg-white text-slate-950 border-slate-200 hover:bg-slate-100'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
            title={siteTheme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            {siteTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                <span>Açık Tema</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                <span>Koyu Tema</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

