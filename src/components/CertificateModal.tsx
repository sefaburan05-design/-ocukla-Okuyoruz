import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Printer, 
  X, 
  Star, 
  Medal, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  HeartHandshake,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Story } from '../types';

interface CertificateModalProps {
  story: Story;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ story, onClose }) => {
  const [recipientName, setRecipientName] = useState<string>(
    story.childName?.trim() || 'Değerli Minik Okurumuz'
  );
  const [selectedTheme, setSelectedTheme] = useState<'gold' | 'purple' | 'emerald'>('gold');

  const formattedDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-3 sm:p-6 space-y-4 sm:space-y-5 relative print:p-0 print:shadow-none print:border-none print:max-w-none print:max-h-none"
      >
        {/* Top Action & Customization Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-400 to-amber-600 text-amber-950 rounded-2xl shadow-md">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Resmi Okur Başarı Sertifikası</span>
                <span className="text-[11px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  Canlı Önizleme
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Çocuğunuzun adını düzenleyin ve yüksek çözünürlükte yazdırın.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-700 dark:text-slate-200 rounded-full cursor-pointer transition shadow-xs"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Inputs (Hidden in Print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl border border-amber-200/80 dark:border-slate-700 print:hidden">
          {/* Child Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Sertifika Sahibinin Adı Soyadı:</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Örn: Zeynep Buran"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Theme Selector */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Sertifika Teması:</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTheme('gold')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-1 border ${
                  selectedTheme === 'gold' 
                    ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-xs' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                👑 Altın Kraliyet
              </button>

              <button
                type="button"
                onClick={() => setSelectedTheme('purple')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-1 border ${
                  selectedTheme === 'purple' 
                    ? 'bg-purple-600 text-white font-black border-purple-700 shadow-xs' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                ✨ Büyülü Yıldızlar
              </button>

              <button
                type="button"
                onClick={() => setSelectedTheme('emerald')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-1 border ${
                  selectedTheme === 'emerald' 
                    ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-xs' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                🌿 Gönül Dostu
              </button>
            </div>
          </div>
        </div>

        {/* HIGH RESOLUTION PRINTABLE CERTIFICATE CARD */}
        <div 
          className={`certificate-printable p-4 sm:p-10 rounded-3xl text-center space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden transition max-w-full ${
            selectedTheme === 'gold'
              ? 'bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 border-4 sm:border-8 border-double border-amber-400 text-slate-900'
              : selectedTheme === 'purple'
              ? 'bg-gradient-to-b from-purple-50 via-indigo-50 to-purple-100 border-4 sm:border-8 border-double border-purple-400 text-slate-900'
              : 'bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 border-4 sm:border-8 border-double border-emerald-400 text-slate-900'
          }`}
        >
          {/* Decorative Corner Seals */}
          <div className="absolute top-2 left-2 text-amber-500 opacity-50 sm:opacity-70">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 fill-amber-400" />
          </div>
          <div className="absolute top-2 right-2 text-amber-500 opacity-50 sm:opacity-70">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 fill-amber-400" />
          </div>

          {/* Certificate Header Banner */}
          <div className="space-y-1.5 pt-2">
            <div className="inline-flex items-center gap-1.5 text-amber-900 text-[10px] sm:text-xs font-black tracking-wider uppercase bg-amber-200/80 px-3 py-1 rounded-full shadow-xs max-w-full text-balance">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-800" />
              <span>Çocukla Okuyoruz — Pedagojik Uyumlu Başarı Belgesi</span>
            </div>
            
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-serif tracking-wide text-amber-950 uppercase pt-1">
              MİNİK OKUR BAŞARI SERTİFİKASI
            </h1>
          </div>

          {/* Recipient Block */}
          <div className="space-y-1 py-2 sm:py-4 border-y-2 border-dashed border-amber-300 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
              Bu Başarı Belgesi Gururla Sunulur:
            </span>
            <div className="text-2xl sm:text-4xl md:text-5xl font-black font-serif text-purple-950 underline decoration-amber-400 decoration-wavy py-1 break-words">
              {recipientName || 'Değerli Minik Okurumuz'}
            </div>
          </div>

          {/* Pedagogy / Achievement Description */}
          <p className="text-xs sm:text-base font-semibold text-slate-800 max-w-2xl mx-auto leading-relaxed px-1">
            "<strong className="text-amber-900 font-bold">{story.title}</strong>" başlıklı {story.contentType.toLowerCase()} eserini büyük bir merak, dikkat ve gayretle okuyup tamamlayarak milli ve manevi değerlerimizi öğrenme yolunda üstün başarı göstermiştir.
          </p>

          {/* Achievement Medals Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 max-w-xl mx-auto pt-1">
            <div className="p-2 sm:p-3 bg-white/90 border border-amber-300 rounded-2xl shadow-xs flex flex-col items-center justify-center space-y-0.5">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              <span className="font-extrabold text-[11px] sm:text-xs text-amber-950">Günün Okuru</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Üstün Gayret</span>
            </div>

            <div className="p-2 sm:p-3 bg-white/90 border border-amber-300 rounded-2xl shadow-xs flex flex-col items-center justify-center space-y-0.5">
              <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <span className="font-extrabold text-[11px] sm:text-xs text-purple-950">Kitap Kaşifi</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Meraklı Okur</span>
            </div>

            <div className="p-2 sm:p-3 bg-white/90 border border-amber-300 rounded-2xl shadow-xs flex flex-col items-center justify-center space-y-0.5">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <span className="font-extrabold text-[11px] sm:text-xs text-emerald-950">Erdemli Karakter</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Gönül Dostu</span>
            </div>
          </div>

          {/* Footer Date and Official Approval */}
          <div className="pt-4 border-t border-amber-300/80 flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-700 max-w-2xl mx-auto gap-1">
            <div className="text-left">
              <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-black">Veriliş Tarihi:</span>
              <span className="text-slate-900 font-extrabold">{formattedDate}</span>
            </div>

            <div className="text-center">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full flex flex-col items-center justify-center font-black mx-auto border-2 border-amber-400 text-[10px] sm:text-xs shadow-md relative group">
                <span className="text-xs sm:text-sm leading-none">🇹🇷</span>
                <span className="text-[8px] sm:text-[9px] font-black tracking-tighter uppercase text-amber-200 mt-0.5">MİLLİ</span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[9px] sm:text-[10px] text-slate-400 uppercase font-black">Onaylayan:</span>
              <span className="font-serif font-black text-slate-950 text-xs sm:text-sm block">Sefa Buran</span>
              <span className="text-[9px] sm:text-[10px] text-amber-900 font-bold block">Çocukla Okuyoruz Proje Ekibi adına</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            💡 Sertifikanızı renkli yazıcıdan çıkartıp çocuğunuzun odasına asabilirsiniz!
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Sertifikayı Yazdır / PDF İndir 🖨️</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
