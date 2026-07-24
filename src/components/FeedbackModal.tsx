import React, { useState } from 'react';
import { MessageSquare, Mail, Send, X, CheckCircle2, Sparkles, Twitter, Instagram } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteTheme: 'light' | 'dark';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, siteTheme }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Görüş ve Öneri' | 'Masal / Hikaye İsteği' | 'Hata Bildirimi' | 'Teşekkür / İletişim'>('Görüş ve Öneri');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create mailto link for direct sending
    const subject = encodeURIComponent(`[Çocukla Okuyoruz - ${category}] ${name ? `${name} - ` : ''}Görüş/Mesaj`);
    const body = encodeURIComponent(`Gönderen Adı: ${name || 'Belirtilmedi'}\nE-posta: ${email || 'Belirtilmedi'}\nKategori: ${category}\n\nMesaj:\n${message}\n\n-------------------\nÇocukla Okuyoruz Platformu üzerinden gönderildi.`);
    
    window.location.href = `mailto:sefaburan.05@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`relative rounded-3xl border p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 transition-all ${
        siteTheme === 'dark' 
          ? 'bg-slate-800 border-slate-700 text-white' 
          : 'bg-white border-purple-100 text-slate-900'
      }`}>
        
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-700 dark:text-slate-200 transition z-50 shadow-md cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Görüş & İletişim Menüsü</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Görüş Bildirin veya İletişime Geçin ✨
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Çocukla Okuyoruz platformunu daha güzel hale getirmek için görüşlerinizi, masal/hikaye isteklerinizi ve fikirlerinizi doğrudan Sefa Buran'a iletebilirsiniz.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-2xl mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-base">
                Mesajınız Hazırlandı ve İletildi!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Görüşünüz için çok teşekkür ederiz. E-posta istemciniz açılmadıysa doğrudan <strong>sefaburan.05@gmail.com</strong> adresine yazabilirsiniz.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Tamam
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">Konu / Kategori:</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Görüş ve Öneri">Görüş ve Öneri 💡</option>
                <option value="Masal / Hikaye İsteği">Özel Masal / Hikaye / Şiir İsteği 📖</option>
                <option value="Hata Bildirimi">Hata Bildirimi 🐛</option>
                <option value="Teşekkür / İletişim">Teşekkür & Genel İletişim ❤️</option>
              </select>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">Adınız (İsteğe Bağlı):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ayşe Hanım"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">E-posta Adresiniz:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">Mesajınız / Görüşünüz (*):</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Düşüncelerinizi, önerilerinizi veya istediğiniz masal konularını yazabilirsiniz..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-none transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Görüşü E-posta ile Gönder (sefaburan.05@gmail.com)</span>
            </button>
          </form>
        )}

        {/* Official Direct Contact Links */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
            Geliştirici Sefa Buran İletişim Kanalları
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <a
              href="mailto:sefaburan.05@gmail.com"
              className="px-3 py-1.5 bg-rose-50 dark:bg-slate-900 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-slate-700 hover:bg-rose-100 transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>sefaburan.05@gmail.com</span>
            </a>

            <a
              href="https://twitter.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 rounded-xl border border-sky-200 dark:border-slate-700 hover:bg-sky-100 transition flex items-center gap-1.5"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>twitter.com/sefaburancom</span>
            </a>

            <a
              href="https://instagram.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-pink-50 dark:bg-slate-900 text-pink-700 dark:text-pink-300 rounded-xl border border-pink-200 dark:border-slate-700 hover:bg-pink-100 transition flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>instagram.com/sefaburancom</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold rounded-xl text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Pencereyi Kapat ✕
          </button>
        </div>

      </div>
    </div>
  );
};
