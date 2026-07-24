import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StoryForm } from './components/StoryForm';
import { StoryReader } from './components/StoryReader';
import { LibraryView } from './components/LibraryView';
import { AboutView } from './components/AboutView';
import { FeedbackModal } from './components/FeedbackModal';
import { AdSenseUnit } from './components/AdSenseUnit';
import { Story, StoryFormData } from './types';
import { SAMPLE_STORIES } from './data/sampleStories';
import { getFullLibraryStories } from './data/libraryGenerator';
import { Mail, Twitter, Instagram, MessageSquare, Heart } from 'lucide-react';

const INITIAL_LIBRARY = [...SAMPLE_STORIES, ...getFullLibraryStories()];

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'library' | 'reader' | 'about'>('create');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [safetyModalState, setSafetyModalState] = useState<{
    isOpen: boolean;
    reason?: string;
    violatingField?: string;
  }>({ isOpen: false });

  // Site Dark/Light Theme State
  const [siteTheme, setSiteTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('cocukla_site_theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('cocukla_site_theme', siteTheme);
    const root = document.documentElement;
    const body = document.body;
    
    if (siteTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      body.style.backgroundColor = '#f8fafc';
      body.style.color = '#0f172a';
    }
  }, [siteTheme]);

  const toggleSiteTheme = () => {
    setSiteTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  // Stories State with library
  const [stories, setStories] = useState<Story[]>(() => {
    // Clear old bloated localStorage key if present
    try {
      localStorage.removeItem('masal_stories_v3');
    } catch (e) {}

    let userStories: Story[] = [];
    try {
      const saved = localStorage.getItem('masal_user_stories_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          userStories = parsed;
        }
      }
    } catch (e) {}

    return [...userStories, ...INITIAL_LIBRARY];
  });

  const [currentStory, setCurrentStory] = useState<Story | null>(INITIAL_LIBRARY[0]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const savedFavs = localStorage.getItem('masal_favorites_v2');
      return savedFavs ? JSON.parse(savedFavs) : ['sample-1'];
    } catch (e) {
      return ['sample-1'];
    }
  });

  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Persist ONLY User Created Stories (prevents QuotaExceededError)
  useEffect(() => {
    try {
      const userStoriesOnly = stories.filter(s => s.id.startsWith('story-') || s.id.startsWith('custom-'));
      localStorage.setItem('masal_user_stories_v1', JSON.stringify(userStoriesOnly));
    } catch (e) {
      console.warn('Could not save user stories to localStorage:', e);
    }
  }, [stories]);

  useEffect(() => {
    try {
      localStorage.setItem('masal_favorites_v2', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Toggle Favorite
  const handleToggleFavorite = (storyId: string) => {
    setFavorites((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  };

  // Select Story
  const handleSelectStory = (story: Story) => {
    setCurrentStory(story);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate Story or Tale via Gemini API
  const handleGenerateStory = async (formData: StoryFormData) => {
    try {
      setIsLoading(true);
      setGenerationError(null);

      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Sunucu hatası oluştu.');
      }

      const generatedData = await response.json();

      const newStory: Story = {
        id: `story-${Date.now()}`,
        contentType: formData.contentType,
        title: generatedData.title || `${formData.childName}'in ${formData.contentType}ı`,
        subtitle: generatedData.subtitle || `${formData.childName} için özel olarak kaleme alınmış neşeli bir ${formData.contentType}.`,
        childName: formData.childName,
        childAge: formData.childAge,
        readingTime: generatedData.readingTime || '5-6 Dakika Okuma Süresi',
        category: generatedData.category || formData.genre || 'Sihirli Macera',
        moralMessage: generatedData.moralMessage || 'Sevgi, cesaret ve dostluk en büyük güçtür.',
        historicalFact: generatedData.historicalFact,
        reflectionQuestions: generatedData.reflectionQuestions,
        miniGlossary: generatedData.miniGlossary,
        createdAt: 'Bugün',
        views: 1,
        chapters: generatedData.chapters || []
      };

      setStories((prev) => [newStory, ...prev]);
      setCurrentStory(newStory);
      setActiveTab('reader');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error('Story generation failed:', err);
      setGenerationError(err.message || 'İçerik üretilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans antialiased flex flex-col justify-between transition-colors">
      
      <div>
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          siteTheme={siteTheme}
          onToggleSiteTheme={toggleSiteTheme}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />

        {/* Main Layout Container with Vertical Side Ads */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 flex gap-4 items-start justify-center">
          
          {/* Left Vertical Ad Banner (Skyscraper) - Desktop */}
          <aside className="hidden xl:block w-48 shrink-0 sticky top-20 space-y-3 print:hidden">
            <AdSenseUnit slot="1606000001" label="Google AdSense (Sol)" />
          </aside>

          {/* Main View Area */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {activeTab === 'create' && (
              <StoryForm
                onGenerate={handleGenerateStory}
                isLoading={isLoading}
                error={generationError}
              />
            )}

            {activeTab === 'reader' && currentStory && (
              <StoryReader
                story={currentStory}
                isFavorite={favorites.includes(currentStory.id)}
                onToggleFavorite={handleToggleFavorite}
                onBackToLibrary={() => setActiveTab('library')}
                allStories={stories}
                onSelectStory={handleSelectStory}
                siteTheme={siteTheme}
              />
            )}

            {activeTab === 'library' && (
              <LibraryView
                stories={stories}
                onSelectStory={handleSelectStory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onNavigateCreate={() => setActiveTab('create')}
              />
            )}

            {activeTab === 'about' && (
              <AboutView
                onNavigateCreate={() => setActiveTab('create')}
                onNavigateLibrary={() => setActiveTab('library')}
              />
            )}
          </main>

          {/* Right Vertical Ad Banner (Skyscraper) - Desktop */}
          <aside className="hidden xl:block w-48 shrink-0 sticky top-20 space-y-3 print:hidden">
            <AdSenseUnit slot="1606000002" label="Google AdSense (Sağ)" />
          </aside>

        </div>
      </div>

      {/* Clean Footer with Sefa Buran Contact Info */}
      <footer className="mt-12 bg-white dark:bg-slate-800 border-t border-purple-100 dark:border-slate-700 py-8 px-4 text-center space-y-4 transition-colors">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Çocukla Okuyoruz</strong>, çocuklarımıza milli ve manevi değerlerimize uygun, kişiselleştirilmiş masal, hikaye ve şiirler oluşturmak için Sefa Buran tarafından geliştirilmiştir.
          </p>

          {/* Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-extrabold">
            <a
              href="mailto:sefaburan.05@gmail.com"
              className="px-3 py-1.5 bg-rose-50 dark:bg-slate-900 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-slate-700 hover:bg-rose-100 transition flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>sefaburan.05@gmail.com</span>
            </a>

            <a
              href="https://twitter.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 rounded-xl border border-sky-200 dark:border-slate-700 hover:bg-sky-100 transition flex items-center gap-1"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>twitter.com/sefaburancom</span>
            </a>

            <a
              href="https://instagram.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-pink-50 dark:bg-slate-900 text-pink-700 dark:text-pink-300 rounded-xl border border-pink-200 dark:border-slate-700 hover:bg-pink-100 transition flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>instagram.com/sefaburancom</span>
            </a>

            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 rounded-xl hover:bg-purple-200 transition flex items-center gap-1 cursor-pointer font-black"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Amacımız</span>
            </button>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Görüş & İletişim 💬</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          © {new Date().getFullYear()} Çocukla Okuyoruz (Sefa Buran) — Tüm Hakları Saklıdır.
        </p>
      </footer>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        siteTheme={siteTheme}
      />

    </div>
  );
}
