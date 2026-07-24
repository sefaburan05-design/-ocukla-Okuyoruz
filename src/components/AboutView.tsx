import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Twitter, 
  Instagram, 
  Award, 
  Compass,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface AboutViewProps {
  onNavigateCreate: () => void;
  onNavigateLibrary: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateCreate, onNavigateLibrary }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Görüş ve Öneri' | 'Uygunsuzluk / Hata Bildirimi' | 'Özel Masal / Hikaye İsteği' | 'Teşekkür / İletişim'>('Görüş ve Öneri');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent(`[Çocukla Okuyoruz - ${category}] ${name ? `${name} - ` : ''}İletişim Formu`);
    const body = encodeURIComponent(`Gönderen Adı: ${name || 'Belirtilmedi'}\nE-posta: ${email || 'Belirtilmedi'}\nKategori: ${category}\n\nMesaj:\n${message}\n\n-------------------\nÇocukla Okuyoruz Amacımız İletişim Kutusu üzerinden gönderildi.`);
    
    window.location.href = `mailto:sefaburan.05@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-8">
      
      {/* Navigation & Header Card */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-white/30">
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
            <span>Misyonumuz ve Vizyonumuz</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateCreate}
              className="px-3.5 py-1.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Eser Oluştur</span>
            </button>
            <button
              onClick={onNavigateLibrary}
              className="px-3.5 py-1.5 bg-purple-900/60 hover:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-400/40 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Kütüphane</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Geleceğe Değerlerimizle Yürüyen Çocuklar İçin 📖✨
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl font-medium leading-relaxed">
            Milli ve manevi erdemlerimizin rehberliğinde, güvenli ve zenginleştirilmiş masal, hikaye ve şiir portalı.
          </p>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-4 sm:space-y-5 text-slate-950 dark:text-slate-100">
        
        {/* Story & Vision Box */}
        <div className="p-5 sm:p-6 bg-purple-50/90 dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-purple-700 shadow-sm space-y-3">
          <h2 className="font-black text-purple-950 dark:text-amber-300 text-base sm:text-lg flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-purple-600 dark:text-amber-400 shrink-0" />
            <span>Bir Babanın Vizyonu ve Doğuş Hikayemiz</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-semibold">
            Merhaba, ben <strong className="text-purple-950 dark:text-amber-300 font-black">Sefa Buran</strong>. 2 çocuk babası bir ebeveyn olarak günümüz dijital çağında evlatlarımızın maruz kaldığı dijital içerik kirliliğini bizzat görüyorum. Çocuklarımızın bu kirli içerik ortamından kurtarırken sadece vakit geçiren değil, okuduğu her satırda özgüven kazanan, kökleriyle bağ kuran bireyler olmasını istedim.
          </p>
        </div>

        {/* Primary Purpose Card (High Contrast) */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-950/80 dark:to-indigo-950/80 rounded-3xl border-2 border-indigo-300 dark:border-purple-600 shadow-md space-y-2.5">
          <div className="flex items-center gap-2 font-black text-indigo-950 dark:text-amber-300 text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-amber-400 shrink-0" />
            <span>Temel Gaye ve Vizyonumuz</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-100 leading-relaxed font-extrabold">
            <strong className="text-purple-950 dark:text-amber-300 font-black">Çocukla Okuyoruz</strong> portalını hayata geçirmemdeki temel gayem; çocuklarımızın milli ve manevi değerlerimizin ışığında, şanlı tarihimizden ve kahramanlarımızdan ilham alarak yetişmelerine katkı sağlamaktır. Geçmişiyle gurur duyan, ecdadının adalet ve merhamet mirasından beslenen evlatlarımızın geleceğe emin adımlarla yürümesini arzuluyoruz.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-amber-50/90 dark:bg-slate-800 rounded-3xl border-2 border-amber-300 dark:border-amber-600/80 space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-300 text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Pedagojik Uyum ve Kriterler</span>
            </div>
            <p className="text-xs sm:text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-bold">
              Sistemimiz, T.C. Milli Eğitim Bakanlığı (MEB) ile Aile ve Sosyal Hizmetler Bakanlığı'nın çocuklar için belirlediği pedagojik standartlara tam uyumlu özel yapay zeka denetimleriyle eğitilmiştir.
            </p>
          </div>

          <div className="p-5 bg-indigo-50/90 dark:bg-slate-800 rounded-3xl border-2 border-indigo-300 dark:border-indigo-600/80 space-y-2">
            <div className="flex items-center gap-2 font-black text-indigo-950 dark:text-indigo-300 text-sm">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Özelleştirilmiş Hayal Dünyası</span>
            </div>
            <p className="text-xs sm:text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-bold">
              Çocuğunuzun ismi, yaşı ve sevdiği temalarla hazırlanan masal, hikaye ve şiirler; okuma sevgisini aşılar ve güvenli dijital içerik tüketimini keyifli bir serüvene dönüştürür.
            </p>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-5 bg-rose-50/90 dark:bg-slate-800 rounded-3xl border-2 border-rose-300 dark:border-rose-700/80 space-y-2">
          <h3 className="font-black text-rose-950 dark:text-rose-300 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Gelişmiş Denetim ve Açık İletişim Sözümüz</span>
          </h3>
          <p className="text-xs sm:text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-bold">
            Her ne kadar platformumuz çok kademeli pedagojik filtreler, etik denetimler ve sıkı güvenlik mekanizmalarıyla korunuyor olsa da, gözden kaçan herhangi bir uygunsuzluk veya geliştirmemiz gereken bir husus hissettiğinizde lütfen çekinmeden bana ulaşın. Her türlü görüş, öneri, istek ve bildiriminiz benim için son derece kıymetlidir.
          </p>
        </div>

      </div>

      {/* Embedded Contact Form Box */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-slate-700 shadow-md space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-700">
          <MessageSquare className="w-6 h-6 text-purple-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-amber-300">
            Sefa Buran'a Doğrudan İletişim Kutusu ✉️
          </h2>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-300 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
              Mesajınız e-posta istemcinize aktarıldı! Doğrudan <strong className="underline">sefaburan.05@gmail.com</strong> adresine iletebilirsiniz.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-emerald-700 transition"
            >
              Yeni Mesaj Gönder
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 dark:text-slate-200">Adınız Soyadınız</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-950 dark:text-slate-100 focus:border-purple-600 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 dark:text-slate-200">E-posta Adresiniz</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta Adresiniz"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-950 dark:text-slate-100 focus:border-purple-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-900 dark:text-slate-200">Konu Kategorisi</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-100 focus:border-purple-600 outline-none cursor-pointer"
              >
                <option value="Görüş ve Öneri">Görüş ve Öneri 💡</option>
                <option value="Uygunsuzluk / Hata Bildirimi">Uygunsuzluk / Hata Bildirimi 🛡️</option>
                <option value="Özel Masal / Hikaye İsteği">Özel Eser İsteği 📖</option>
                <option value="Teşekkür / İletişim">Teşekkür ve İletişim ❤️</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-900 dark:text-slate-200">Mesajınız <span className="text-rose-500">*</span></label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Görüşünüzü, önerinizi veya bildirmek istediğiniz hususları yazabilirsiniz..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-950 dark:text-slate-100 focus:border-purple-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Mesajı Gönder (sefaburan.05@gmail.com)</span>
            </button>
          </form>
        )}

        {/* Direct Social & Mail Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-black">
          <a
            href="mailto:sefaburan.05@gmail.com"
            className="px-4 py-2.5 bg-rose-50 dark:bg-slate-950 text-rose-950 dark:text-rose-200 rounded-xl border-2 border-rose-300 dark:border-slate-700 hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>sefaburan.05@gmail.com</span>
          </a>

          <a
            href="https://twitter.com/sefaburancom"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-sky-50 dark:bg-slate-950 text-sky-950 dark:text-sky-200 rounded-xl border-2 border-sky-300 dark:border-slate-700 hover:bg-sky-100 transition flex items-center gap-1.5"
          >
            <Twitter className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>twitter.com/sefaburancom</span>
          </a>

          <a
            href="https://instagram.com/sefaburancom"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-pink-50 dark:bg-slate-950 text-pink-950 dark:text-pink-200 rounded-xl border-2 border-pink-300 dark:border-slate-700 hover:bg-pink-100 transition flex items-center gap-1.5"
          >
            <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
            <span>instagram.com/sefaburancom</span>
          </a>
        </div>

      </div>

    </div>
  );
};
