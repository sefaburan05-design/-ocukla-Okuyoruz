import React from 'react';
import { DollarSign, ShieldCheck, Sparkles, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const AboutMonetization: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-amber-300" />
          <span>Pasif Gelir & Yayıncı Rehberi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">
          Bu Sistemle Nasıl Pasif Gelir Elde Edilir? 💰
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
          Yazılım veya veritabanı bilgisi gerektirmeden, oluşturduğunuz çocuk masal ve hikayelerinden reklam geliri kazanmanın en basit yolu.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-base">
            1
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Google AdSense Başvurusu
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Siteniz için Google AdSense hesabınıza başvurup onay aldıktan sonra, metin aralarındaki reklam kodlarını sitenize ekleyerek her okumada otomatik tık ve gösterim geliri kazanırsınız.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-base">
            2
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Çocuk Ürünleri ve Oyuncak Sponsorlukları
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ebeveynlerin sıklıkla masal okuduğu bu platformda, oyuncak, çocuk kitabı ve eğitici materyal satıcılarından doğrudan sponsorlu banner ilanları alabilirsiniz.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-base">
            3
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Tüm Cihazlarla Tam Uyumlu Arayüz
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Telefon, tablet ve bilgisayarlardan kolayca erişilebilir. Ebeveynler çocukları uyuturken gece modunda veya sesli okuma özelliğini açarak rahatlıkla kullanır.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-base">
            4
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Veritabanı veya Kod Bilgisi Gerektirmez
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Yapay zeka motoru tüm hikaye ve masalları otomatik olarak kütüphanede depolar. Ekstra sunucu kurmanıza ya da karmaşık kod yazmanıza gerek yoktur.
          </p>
        </div>

      </div>

      {/* Child Safety Banner */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
        <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-900">Güvenli İçerik & Aile Dostu Standartlar</h4>
          <p className="text-slate-600 leading-relaxed">
            Platform altyapımız çocuk gelişimine aykırı hiçbir olumsuz öge barındırmaz. AdSense Aile Dostu Reklam Politikalarına %100 uyumludur.
          </p>
        </div>
      </div>

    </div>
  );
};
