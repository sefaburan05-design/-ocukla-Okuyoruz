import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight,
  Plus,
  Filter,
  X,
  Tag,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import { Story } from '../types';

interface LibraryViewProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  favorites: string[];
  onToggleFavorite: (storyId: string) => void;
  onNavigateCreate: () => void;
}

const CATEGORIES = [
  "Tüm Kategoriler",
  "Milli ve Manevi Değerlerimiz & Erdemler",
  "Tarihi Kahramanlar ve Milli Gurur",
  "Peygamberimizin Sünneti ve Güzel Ahlak",
  "Eğlenceli Macera ve Hayal Gücü",
  "Eğitici & Öğretici Hikayeler",
  "Doğa ve Hayvan Sevgisi",
  "Dürüstlük, Paylaşım ve Yardımlaşma",
  "Bilim, Sanat ve Keşif Yolculuğu"
];

const AGE_GROUPS = [
  "Tüm Yaş Grupları",
  "3-5 Yaş (Anaokulu)",
  "5-7 Yaş (Okul Öncesi & İlkokul)",
  "6-8 Yaş (İlkokul Çağı)",
  "7-9 Yaş (Maceracı Çocuklar)",
  "8-10 Yaş (İlkokul Üst Seviye)"
];

const QUICK_TOPICS = [
  { label: 'Tümü', key: '' },
  { label: '🇹🇷 Atatürk & 23 Nisan', key: 'Atatürk' },
  { label: '🌹 Peygamberimizin Sünneti', key: 'Peygamber' },
  { label: '🛡️ Çanakkale & Vatan', key: 'Çanakkale' },
  { label: '🔬 Bilim & Keşif', key: 'Bilim' },
  { label: '🤝 Dürüstlük & Erdem', key: 'Dürüstlük' },
  { label: '🌱 Doğa & Hayvanlar', key: 'Doğa' }
];

export const LibraryView: React.FC<LibraryViewProps> = ({
  stories,
  onSelectStory,
  favorites,
  onToggleFavorite,
  onNavigateCreate
}) => {
  const [filterType, setFilterType] = useState<'Hepsi' | 'Masal' | 'Hikaye' | 'Şiir'>('Hepsi');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tüm Kategoriler');
  const [selectedAge, setSelectedAge] = useState<string>('Tüm Yaş Grupları');
  const [quickTopic, setQuickTopic] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Check if any filters are active
  const hasActiveFilters = 
    filterType !== 'Hepsi' || 
    selectedCategory !== 'Tüm Kategoriler' || 
    selectedAge !== 'Tüm Yaş Grupları' || 
    quickTopic !== '' || 
    searchTerm.trim() !== '';

  const clearAllFilters = () => {
    setFilterType('Hepsi');
    setSelectedCategory('Tüm Kategoriler');
    setSelectedAge('Tüm Yaş Grupları');
    setQuickTopic('');
    setSearchTerm('');
    setVisibleCount(36);
  };

  const filteredStories = useMemo(() => {
    return stories.filter((st) => {
      // Content Type Filter
      const matchesType = filterType === 'Hepsi' || st.contentType === filterType;
      
      // Category Filter
      const matchesCategory = 
        selectedCategory === 'Tüm Kategoriler' || 
        st.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory.includes('&') && selectedCategory.split('&').some(c => st.category.includes(c.trim())));

      // Age Filter
      const matchesAge = 
        selectedAge === 'Tüm Yaş Grupları' || 
        (st.childAge && st.childAge.includes(selectedAge.split(' ')[0]));

      // Quick Topic Filter
      const matchesQuickTopic = 
        !quickTopic || 
        st.title.toLowerCase().includes(quickTopic.toLowerCase()) ||
        st.subtitle.toLowerCase().includes(quickTopic.toLowerCase()) ||
        st.moralMessage.toLowerCase().includes(quickTopic.toLowerCase());

      // Search Term Filter
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = 
        !term ||
        st.title.toLowerCase().includes(term) ||
        st.childName.toLowerCase().includes(term) ||
        st.category.toLowerCase().includes(term) ||
        st.subtitle.toLowerCase().includes(term);

      return matchesType && matchesCategory && matchesAge && matchesQuickTopic && matchesSearch;
    });
  }, [stories, filterType, selectedCategory, selectedAge, quickTopic, searchTerm]);

  const displayedStories = filteredStories.slice(0, visibleCount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            Zengin Eser Arşivi ({stories.length.toLocaleString('tr-TR')} Eser)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Milli & Manevi Değerler Kütüphanesi 📚
          </h2>
          <p className="text-purple-100 text-xs mt-1">
            Atatürk, Peygamberimiz, milli kahramanlar, bilim ve doğa konulu 1.000 Masal, 1.000 Hikaye ve 1.000 Şiir.
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-5 py-3 rounded-2xl text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Eser Oluştur</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-purple-100 dark:border-slate-700 shadow-md space-y-4 transition-colors">
        
        {/* Top Row: Type Tabs & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Type Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto">
            {(['Hepsi', 'Masal', 'Hikaye', 'Şiir'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setVisibleCount(36);
                }}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  filterType === t
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(36);
              }}
              placeholder="Başlık, konu veya çocuk adı..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Dropdown Filters Row: Category & Age Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-600" />
              <span>Konu / Kategori Filtresi</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(36);
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-500" />
              <span>Yaş Grubu Filtresi</span>
            </label>
            <select
              value={selectedAge}
              onChange={(e) => {
                setSelectedAge(e.target.value);
                setVisibleCount(36);
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
            >
              {AGE_GROUPS.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Topic Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Hızlı Konu Başlıkları:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_TOPICS.map((top) => {
              const isActive = quickTopic === top.key;
              return (
                <button
                  key={top.label}
                  onClick={() => {
                    setQuickTopic(top.key);
                    setVisibleCount(36);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                  }`}
                >
                  {top.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary & Reset Button */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 flex-wrap text-slate-600 dark:text-slate-400">
              <Filter className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-bold">Aktif Filtreler:</span>
              {filterType !== 'Hepsi' && (
                <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Tür: {filterType}
                </span>
              )}
              {selectedCategory !== 'Tüm Kategoriler' && (
                <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Kategori: {selectedCategory.split('&')[0]}
                </span>
              )}
              {selectedAge !== 'Tüm Yaş Grupları' && (
                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Yaş: {selectedAge.split(' ')[0]}
                </span>
              )}
              {quickTopic && (
                <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Konu: {quickTopic}
                </span>
              )}
              {searchTerm && (
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Arama: "{searchTerm}"
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-600 font-extrabold text-xs flex items-center gap-1 cursor-pointer hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Filtreleri Temizle</span>
            </button>
          </div>
        )}

      </div>

      {/* Story Grid */}
      {filteredStories.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 space-y-3 shadow-sm">
          <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">
            Seçtiğiniz filtrelerle eşleşen bir eser bulunamadı.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Filtreleri temizleyebilir veya yapay zeka ile istediğiniz konuda anında yeni bir eser oluşturabilirsiniz.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Tüm Filtreleri Temizle
            </button>
            <button
              onClick={onNavigateCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Yeni Eser Oluştur
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
            <span>Toplam {filteredStories.length.toLocaleString('tr-TR')} eser bulundu</span>
            <span>Gösterilen: {displayedStories.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedStories.map((story) => {
              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 p-5 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold px-2.5 py-0.5 rounded-md">
                          {story.contentType}
                        </span>
                        {story.childAge && (
                          <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {story.childAge}
                          </span>
                        )}
                      </div>

                      <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/60 font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {story.readingTime || '5 Dakika Okuma'}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectStory(story)}
                      className="font-black text-slate-900 dark:text-slate-100 text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition cursor-pointer line-clamp-1"
                    >
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {story.subtitle}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="line-clamp-1 italic font-medium">{story.category}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Kahraman: <strong className="text-purple-600 dark:text-purple-400">{story.childName}</strong>
                    </span>

                    <button
                      onClick={() => onSelectStory(story)}
                      className="bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Oku / Dinle</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredStories.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md transition cursor-pointer"
              >
                Daha Fazla Eser Göster ({displayedStories.length} / {filteredStories.length.toLocaleString('tr-TR')} Gösteriliyor)
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
