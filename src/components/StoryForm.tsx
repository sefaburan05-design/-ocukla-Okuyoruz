import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  User, 
  Users, 
  MapPin, 
  Smile, 
  Wand2, 
  Heart,
  HelpCircle,
  Loader2,
  ShieldAlert,
  RotateCcw,
  X
} from 'lucide-react';
import { StoryFormData } from '../types';
import { validateStoryFormSafety } from '../utils/safetyFilter';

interface StoryFormProps {
  onGenerate: (formData: StoryFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onGenerate, isLoading, error }) => {
  const [contentType, setContentType] = useState<'Masal' | 'Hikaye' | 'Şiir'>('Masal');
  const [genre, setGenre] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('6-7 Yaş (İlkokul Başlangıç)');
  const [heroes, setHeroes] = useState('');
  const [location, setLocation] = useState('');
  const [specialDetails, setSpecialDetails] = useState('');
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  const safetyBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to safety warning when it appears
  useEffect(() => {
    if (safetyNotice || (error && (error.includes('uygunsuz') || error.includes('küfür') || error.includes('pedagojik') || error.includes('tehdit') || error.includes('zararlı')))) {
      safetyBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [safetyNotice, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSafetyNotice(null);

    if (!genre) {
      const typeLabel = contentType === 'Masal' ? 'masalın' : contentType === 'Hikaye' ? 'hikayenin' : 'şiirin';
      alert(`Lütfen ${typeLabel} konusunu seçiniz.`);
      return;
    }
    if (!childName.trim()) {
      alert('Lütfen çocuğun adını giriniz.');
      return;
    }

    // 1. Client-Side Safety & Pedagogical Filter Check
    const safetyCheck = validateStoryFormSafety({
      childName,
      heroes,
      location,
      genre,
      specialDetails
    });

    if (!safetyCheck.isSafe) {
      setSafetyNotice(
        safetyCheck.detectedReason || 
        'Girdiğiniz bilgilerde küfür, hakaret, tehdit, şantaj, zorbalık veya pedagojik açıdan çocuk gelişimine aykırı ifadeler tespit edildi.'
      );
      return;
    }

    onGenerate({
      contentType,
      childName,
      childAge,
      heroes,
      location,
      genre: genre || 'Milli ve Manevi Değerlerimiz',
      specialDetails
    });
  };

  const handleResetFormInputs = () => {
    setSafetyNotice(null);
    setChildName('');
    setHeroes('');
    setLocation('');
    setSpecialDetails('');
  };

  const isSafetyViolationActive = Boolean(
    safetyNotice || (error && (error.includes('uygunsuz') || error.includes('küfür') || error.includes('pedagojik') || error.includes('tehdit') || error.includes('zararlı')))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">

      {/* Pop-up Safety Warning Modal Overlay */}
      {isSafetyViolationActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSafetyNotice(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-600 hover:text-white transition"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 shadow-lg">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 pr-6">
                <h3 className="text-lg sm:text-xl font-black text-rose-950 dark:text-rose-100">
                  Uygunsuz veya Etik Dışı İfade Algılandı!
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-rose-900 dark:text-rose-300 leading-relaxed">
                  {safetyNotice || error}
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/70 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed space-y-1.5">
              <p>
                Platformumuz çocuk güvenliğini, milli-manevi erdemleri ve pedagojik ilkeleri esas almaktadır. Küfür, hakaret, tehdit, şantaj, zorbalık veya olumsuz ögeler içeren taleplerle masal, hikaye ya da şiir üretilemez.
              </p>
              <p className="text-purple-900 dark:text-purple-300 font-extrabold">
                Lütfen formdaki bilgileri güncelleyerek yeni bilgilerle içerik üretmeye devam ediniz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleResetFormInputs}
                className="w-full sm:flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs sm:text-xs font-black flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Formu Temizle ve Yeni Bilgilerle Dene</span>
              </button>
              <button
                type="button"
                onClick={() => setSafetyNotice(null)}
                className="w-full sm:w-auto py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-2xl text-xs sm:text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                İfadeleri Düzenle
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Intro Box */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Saniyeler İçinde Çocuğuna/Sana Özel Eser
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/80 px-3 py-1 rounded-full text-xs font-extrabold text-white">
              🛡️ Milli ve Manevi Değerlere Tam Uyumlu
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Çocuğunuza Özel Masal, Hikaye veya Şiir Oluşturun 📖
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
            Çocuğunuzun adı ve seveceği detaylarla; MEB ve Aile ve Sosyal Hizmetler Bakanlığı politikalarına tam uyumlu, pedagojik açıdan güvenli, milli-manevi erdemler içeren ve renkli özel illüstrasyonlu eşsiz bir eser hazırlayın!
          </p>
        </div>
      </div>

      {/* Prominent Inline Inappropriate Content / Safety Warning Box */}
      {isSafetyViolationActive && (
        <div ref={safetyBoxRef} className="p-6 bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-100 rounded-3xl shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-rose-950 dark:text-rose-100">
                ⚠️ Uygunsuz veya Etik Dışı İfade Algılandı!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200 leading-relaxed">
                {safetyNotice || error}
              </p>
              <p className="text-xs text-rose-800 dark:text-rose-300 font-semibold leading-relaxed">
                Platformumuz çocuk güvenliğini, milli-manevi erdemleri ve pedagojik ilkeleri esas almaktadır. Küfür, hakaret, tehdit, şantaj, zorbalık veya olumsuz ögeler içeren taleplerle masal, hikaye ya da şiir üretilemez.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFormInputs}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Formu Temizle ve Yeni Bilgilerle Tekrar Dene</span>
            </button>
            <button
              type="button"
              onClick={() => setSafetyNotice(null)}
              className="px-4 py-2.5 bg-rose-100 dark:bg-rose-900/80 hover:bg-rose-200 dark:hover:bg-rose-800 text-rose-950 dark:text-rose-100 rounded-xl text-xs sm:text-xs font-black transition cursor-pointer border border-rose-300 dark:border-rose-700"
            >
              Girdiğim İfadeleri Düzenle
            </button>
          </div>
        </div>
      )}

      {/* Generic Error Display */}
      {error && !error.includes('uygunsuz') && !error.includes('küfür') && !error.includes('pedagojik') && !error.includes('tehdit') && !error.includes('zararlı') && (
        <div className="p-4 bg-red-50 dark:bg-red-950/80 border-2 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs font-bold rounded-2xl flex items-center gap-2">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Modal Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-300 dark:border-purple-600 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {contentType === 'Masal' && 'Masalınız birkaç saniye içerisinde hazır olacak... ✨'}
                {contentType === 'Hikaye' && 'Hikayeniz birkaç saniye içerisinde hazır olacak... 📚'}
                {contentType === 'Şiir' && 'Şiiriniz birkaç saniye içerisinde hazır olacak... 📜'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Yapay zekamız, {childName || 'çocuğunuz'} için pedagojik ilkelere, milli ve manevi değerlerimize uygun harika bir {contentType.toLowerCase()} kaleme alıyor ve özel illüstrasyonlarını hazırlıyor.
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[11px] text-purple-800 dark:text-purple-200 font-semibold flex items-center justify-center gap-2 border border-purple-100 dark:border-purple-900">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <span>Lütfen ekranı kapatmayın, sihirli an geliyor!</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
        
        {/* 1. Content Type Selector (Masal vs Hikaye vs Şiir) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Eser Türünü Seçin <span className="text-red-500">*</span></span>
          </label>

          {/* Mobile Select Dropdown (Saves vertical space) */}
          <div className="block sm:hidden">
            <select
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value as 'Masal' | 'Hikaye' | 'Şiir');
                setGenre('');
              }}
              className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-600 dark:border-purple-500 rounded-2xl text-sm font-extrabold text-purple-900 dark:text-purple-200 outline-none cursor-pointer"
            >
              <option value="Masal">✨ Sihirli Masal (Efsanevi & Hayal Gücü)</option>
              <option value="Hikaye">📚 Gerçekçi Hikaye (Okul & Doğa & Aile)</option>
              <option value="Şiir">📜 Ahenkli Şiir (Kafiyeli & Ezber)</option>
            </select>
          </div>

          {/* Desktop Button Cards Grid */}
          <div className="hidden sm:grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setContentType('Masal');
                setGenre('');
              }}
              className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition flex flex-col items-center gap-1.5 cursor-pointer ${
                contentType === 'Masal'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-200 dark:hover:border-purple-800 bg-slate-50 dark:bg-slate-900/60'
              }`}
            >
              <span className="text-2xl">✨</span>
              <span>Sihirli Masal</span>
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 text-center">
                Efsanevi şatolar, uçan adalar ve hayal gücü
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContentType('Hikaye');
                setGenre('');
              }}
              className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition flex flex-col items-center gap-1.5 cursor-pointer ${
                contentType === 'Hikaye'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-200 dark:hover:border-purple-800 bg-slate-50 dark:bg-slate-900/60'
              }`}
            >
              <span className="text-2xl">📚</span>
              <span>Gerçekçi Hikaye</span>
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 text-center">
                Okul, aile, doğa gezileri ve arkadaşlık
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContentType('Şiir');
                setGenre('');
              }}
              className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition flex flex-col items-center gap-1.5 cursor-pointer ${
                contentType === 'Şiir'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-200 dark:hover:border-purple-800 bg-slate-50 dark:bg-slate-900/60'
              }`}
            >
              <span className="text-2xl">📜</span>
              <span>Ahenkli Şiir</span>
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 text-center">
                Duygu dolu, kafiyeli, ezberlemesi kolay kıtalar
              </span>
            </button>
          </div>
        </div>

        {/* 2. Prominent Topic / Genre Selector */}
        <div className="space-y-2 p-4 bg-purple-50 dark:bg-slate-900 rounded-2xl border-2 border-purple-300 dark:border-purple-700/80 shadow-xs">
          <label className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
            <Smile className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{contentType === 'Masal' ? 'Masalın Konusu' : contentType === 'Hikaye' ? 'Hikayenin Konusu' : 'Şiirin Konusu'} <span className="text-red-500">*</span></span>
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={`w-full px-3.5 sm:px-4 py-3 bg-white dark:bg-slate-950 border-2 ${
              !genre 
                ? 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20 text-purple-950 dark:text-purple-200 font-extrabold' 
                : 'border-purple-200 dark:border-purple-700 font-bold text-slate-900 dark:text-slate-100'
            } rounded-2xl text-xs sm:text-sm outline-none cursor-pointer transition`}
          >
            <option value="" disabled className="text-slate-400 font-bold text-xs sm:text-sm">
              {`Lütfen ${contentType === 'Masal' ? 'Masalın' : contentType === 'Hikaye' ? 'Hikayenin' : 'Şiirin'} Konusunu Seçiniz`}
            </option>
            <option value="Milli ve Manevi Değerlerimiz">🇹🇷 Milli ve Manevi Değerlerimiz & Erdemler</option>
            <option value="Eğlenceli Macera">🚀 Eğlenceli Macera</option>
            <option value="Uyku Vakti & Rahatlatıcı">🌙 Uyku Vakti (Sakinleştirici)</option>
            <option value="Eğitici & Bilgi Verici">💡 Eğitici & Öğretici</option>
            <option value="Komik & Kahkaha Dolu">😄 Komik & Kahkaha Dolu</option>
            <option value="Doğa ve Hayvan Sevgisi">🐾 Doğa ve Hayvan Sevgisi</option>
            <option value="Dürüstlük ve Yardımlaşma">🤝 Dürüstlük, Paylaşım ve Yardımlaşma</option>
          </select>
        </div>

        {/* 2. Child Name & Age Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Çocuğun Adı <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Örn: Can, Zeynep, Ali..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Çocuğun Yaş Grubu</span>
            </label>
            <select
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
            >
              <option value="2-3 Yaş">2-3 Yaş (Okul Öncesi Minikler)</option>
              <option value="4-5 Yaş">4-5 Yaş (Anaokulu Çağı)</option>
              <option value="6-7 Yaş">6-7 Yaş (İlkokul Başlangıç)</option>
              <option value="8-10 Yaş">8-10 Yaş (İlkokul Macera)</option>
              <option value="11-13 Yaş">11-13 Yaş (Ortaokul Çağı)</option>
            </select>
          </div>
        </div>

        {/* 3. Heroes & Characters */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Olmasını İstediği Kahramanlar & Dostlar</span>
          </label>
          <input
            type="text"
            value={heroes}
            onChange={(e) => setHeroes(e.target.value)}
            placeholder={contentType === 'Masal' ? "Örn: Konuşan Zümrüdüanka Kuşu, Minik Peri, Uçan Ejderha Bobi..." : "Örn: Sadık köpek Fındık, Okul arkadaşı Mert, Öğretmen Sevgi..."}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        {/* 4. Location / Setting */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Mekan / Geçtiği Yer</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={contentType === 'Masal' ? "Örn: Kristal Pamuk Şato, Bulutlar Ülkesi, Sihirli Orman..." : "Örn: Çiçekli Mahalle, Yeşil Okul Bahçesi, Köy Evi..."}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        {/* 5. Special Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Ek Özelleştirmeler (İsteğe Bağlı)</span>
          </label>
          <textarea
            rows={2}
            value={specialDetails}
            onChange={(e) => setSpecialDetails(e.target.value)}
            placeholder="Örn: Sebze yemeyi sevsin, büyüklere hürmeti öğrensin, paylaşmanın güzelliğini anlasın..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black py-4 rounded-2xl text-base shadow-lg shadow-purple-200 dark:shadow-none transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sihirli Kalem {contentType}'ı Kaleme Alıyor...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-amber-300" />
              <span>Sihirli {contentType}'ı Hemen Oluştur →</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};
