import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  Sparkles, 
  Bookmark, 
  Share2, 
  ArrowLeft,
  Image as ImageIcon,
  BookOpen,
  Printer,
  ShieldAlert,
  HelpCircle,
  History,
  Settings,
  Mic,
  FastForward,
  Mail,
  Twitter,
  Instagram,
  Award,
  Trophy,
  Star,
  CheckCircle2,
  Medal,
  Palette
} from 'lucide-react';
import { Story } from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { ColoringBook } from './ColoringBook';
import { CertificateModal } from './CertificateModal';

// Topic-aware fallback illustrations pool ensuring rich visual variety
const TOPIC_FALLBACKS: Record<string, string[]> = {
  cat: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80'
  ],
  castle: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80'
  ]
};

const FALLBACK_ILLUSTRATIONS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
];

interface StoryReaderProps {
  story: Story;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBackToLibrary: () => void;
  allStories?: Story[];
  onSelectStory?: (story: Story) => void;
  siteTheme?: 'light' | 'dark';
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  isFavorite,
  onToggleFavorite,
  onBackToLibrary,
  allStories = [],
  onSelectStory,
  siteTheme
}) => {
  // Reading Mode Theme State (Defaults or syncs with siteTheme)
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark' | 'sepia'>(() => {
    return siteTheme === 'dark' ? 'dark' : 'light';
  });

  // Automatically update readingTheme when siteTheme changes (unless user explicitly selected sepia)
  useEffect(() => {
    if (siteTheme === 'dark') {
      setReadingTheme('dark');
    } else if (siteTheme === 'light') {
      setReadingTheme('light');
    }
  }, [siteTheme]);

  // Font Size Control State
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2);

  // Certificate Display State
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Coloring Book Display State
  const [showColoringBook, setShowColoringBook] = useState<boolean>(false);

  // Text-To-Speech Sequential State
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isPausedSpeech, setIsPausedSpeech] = useState(false);
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number>(-1);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Ideal default storytelling speed (1.0x)
  const [speechPitch, setSpeechPitch] = useState<number>(1.25); // Gentle, warm female pitch
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Natural Human Gemini AI Voice State
  const [useNaturalAI, setUseNaturalAI] = useState<boolean>(true);
  const [selectedGeminiVoice, setSelectedGeminiVoice] = useState<string>('Kore');
  const [isFetchingTTS, setIsFetchingTTS] = useState<boolean>(false);
  const [isPlayingNaturalAudio, setIsPlayingNaturalAudio] = useState<boolean>(false);
  const naturalAudioRef = useRef<HTMLAudioElement | null>(null);

  // References for Sequential Audio Queue & Instant Settings Reactivity
  const speechChunksRef = useRef<string[]>([]);
  const isCancelledRef = useRef<boolean>(false);
  const speechRateRef = useRef<number>(1.0);
  const speechPitchRef = useRef<number>(1.25);
  const selectedVoiceURIRef = useRef<string>('');

  // Synchronize state to refs for live speech synthesis access
  useEffect(() => {
    speechRateRef.current = speechRate;
    speechPitchRef.current = speechPitch;
    selectedVoiceURIRef.current = selectedVoiceURI;
  }, [speechRate, speechPitch, selectedVoiceURI]);

  // Compute recommended similar stories for infinite continuous reading
  const recommendedStories = React.useMemo(() => {
    if (!allStories || allStories.length === 0) return [];
    const others = allStories.filter(s => s.id !== story.id);
    const sorted = [...others].sort((a, b) => {
      const aSameType = a.contentType === story.contentType ? 2 : 0;
      const bSameType = b.contentType === story.contentType ? 2 : 0;
      const aSameAge = a.childAge === story.childAge ? 1 : 0;
      const bSameAge = b.childAge === story.childAge ? 1 : 0;
      return (bSameType + bSameAge) - (aSameType + aSameAge);
    });
    return sorted.slice(0, 3);
  }, [allStories, story.id, story.contentType, story.childAge]);

  // Instantly re-apply speech settings during active playback when user alters voice, pitch or rate
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isPlayingSpeech && !isPausedSpeech && currentChunkIdx >= 0) {
      speakChunkAtIndex(currentChunkIdx);
    }
  }, [speechRate, speechPitch, selectedVoiceURI]);

  // Chapter Image State & Loading Tracking
  const [chapterImages, setChapterImages] = useState<Record<number, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [generatingImageIdx, setGeneratingImageIdx] = useState<number | null>(null);

  // Copy Link State
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper to split long text into clean sentences so SpeechSynthesis never gets cut off
  const splitIntoSentences = (text: string): string[] => {
    if (!text) return [];
    return text
      .replace(/\n/g, ' ')
      .replace(/([.?!])\s+/g, '$1|')
      .split('|')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // Build audio chunks array (paragraphs / stanzas split into clean sentences)
  useEffect(() => {
    const chunks: string[] = [];
    
    // Add title and subtitle
    chunks.push(...splitIntoSentences(`${story.title}. ${story.subtitle}`));

    story.chapters.forEach((ch) => {
      if (ch.chapterTitle && story.contentType !== 'Şiir' && !ch.chapterTitle.includes('Kıta')) {
        chunks.push(ch.chapterTitle);
      }
      ch.paragraphs.forEach((para) => {
        if (para.trim()) {
          chunks.push(...splitIntoSentences(para));
        }
      });
    });

    speechChunksRef.current = chunks;
    setCurrentChunkIdx(-1);
    stopSpeech();
  }, [story]);

  // Sync chapter images when story prop changes
  useEffect(() => {
    const initial: Record<number, string> = {};
    story.chapters.forEach((ch, idx) => {
      initial[idx] = ch.generatedImageUrl || FALLBACK_ILLUSTRATIONS[idx % FALLBACK_ILLUSTRATIONS.length];
    });
    setChapterImages(initial);
  }, [story]);

  // Load and select best Turkish Female Voice
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const trVoices = voices.filter(v => v.lang.toLowerCase().includes('tr'));
        const activeVoiceList = trVoices.length > 0 ? trVoices : voices;
        setAvailableVoices(activeVoiceList);

        // Find best Turkish Female Voice excluding male voice names like Tolga, Ahmet, etc.
        const femaleVoice = activeVoiceList.find(v => {
          const name = v.name.toLowerCase();
          const isMaleName = name.includes('tolga') || name.includes('ahmet') || name.includes('mehmet') || name.includes('cem') || name.includes('male');
          if (isMaleName) return false;
          return (
            name.includes('female') ||
            name.includes('yelda') ||
            name.includes('zeynep') ||
            name.includes('seda') ||
            name.includes('gül') ||
            name.includes('hazal') ||
            name.includes('fatma') ||
            name.includes('filiz') ||
            name.includes('deniz') ||
            name.includes('google türkçe') ||
            name.includes('siri')
          );
        }) || activeVoiceList.find(v => !v.name.toLowerCase().includes('tolga')) || activeVoiceList[0];

        if (femaleVoice && !selectedVoiceURI) {
          setSelectedVoiceURI(femaleVoice.voiceURI);
        }
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Sequential Playback Function
  const speakChunkAtIndex = (index: number) => {
    if (!('speechSynthesis' in window)) {
      alert('Üzgünüz, tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    if (index >= speechChunksRef.current.length || isCancelledRef.current) {
      setIsPlayingSpeech(false);
      setIsPausedSpeech(false);
      setCurrentChunkIdx(-1);
      return;
    }

    window.speechSynthesis.cancel(); // Clear previous utterance

    const textToSpeak = speechChunksRef.current[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'tr-TR';
    utterance.rate = speechRateRef.current;
    utterance.pitch = speechPitchRef.current; // Warm female / motherly pitch level

    if (selectedVoiceURIRef.current) {
      const selectedVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURIRef.current);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      if (!isCancelledRef.current) {
        const nextIdx = index + 1;
        setCurrentChunkIdx(nextIdx);
        speakChunkAtIndex(nextIdx);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis chunk error:', e);
      if (!isCancelledRef.current) {
        const nextIdx = index + 1;
        setCurrentChunkIdx(nextIdx);
        speakChunkAtIndex(nextIdx);
      }
    };

    setCurrentChunkIdx(index);
    setIsPlayingSpeech(true);
    setIsPausedSpeech(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Üzgünüz, tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    if (isPlayingSpeech) {
      if (isPausedSpeech) {
        window.speechSynthesis.resume();
        setIsPausedSpeech(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedSpeech(true);
      }
    } else {
      isCancelledRef.current = false;
      const startIdx = currentChunkIdx >= 0 ? currentChunkIdx : 0;
      speakChunkAtIndex(startIdx);
    }
  };

  const stopSpeech = () => {
    isCancelledRef.current = true;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current = null;
    }
    setIsPlayingNaturalAudio(false);
    setIsPlayingSpeech(false);
    setIsPausedSpeech(false);
    setCurrentChunkIdx(-1);
  };

  // Helper to convert base64 audio/PCM to playable Object URL
  const createAudioFromBase64 = (base64Data: string, mimeType: string) => {
    if (mimeType.includes('mp3') || mimeType.includes('mpeg') || mimeType.includes('ogg')) {
      return `data:${mimeType};base64,${base64Data}`;
    }

    try {
      // Build standard RIFF WAV header wrapper for 24kHz 16-bit mono PCM
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const buffer = new ArrayBuffer(44 + len);
      const view = new DataView(buffer);

      view.setUint32(0, 0x52494646, false); // "RIFF"
      view.setUint32(4, 36 + len, true);
      view.setUint32(8, 0x57415645, false); // "WAVE"
      view.setUint32(12, 0x666d7420, false); // "fmt "
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, 24000, true); // 24kHz
      view.setUint32(28, 24000 * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      view.setUint32(36, 0x64617461, false); // "data"
      view.setUint32(40, len, true);

      const bytes = new Uint8Array(buffer, 44);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    } catch {
      return `data:audio/wav;base64,${base64Data}`;
    }
  };

  // Audio Cache for fast chapter-level playback
  const ttsAudioCacheRef = useRef<Map<string, string>>(new Map());

  // Natural Gemini AI Voice Handler
  const handlePlayNaturalTTS = async () => {
    if (isPlayingNaturalAudio && naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      setIsPlayingNaturalAudio(false);
      return;
    }

    if (naturalAudioRef.current) {
      naturalAudioRef.current.play();
      setIsPlayingNaturalAudio(true);
      return;
    }

    stopSpeech();

    // Build complete story narration (title, subtitle, chapters & paragraphs) up to 3000 characters for rich full-story audio
    const allChaptersText = story.chapters
      .map((ch) => `${ch.chapterTitle ? ch.chapterTitle + '. ' : ''}${ch.paragraphs.join(' ')}`)
      .join(' ');
    const textToNarrate = `${story.title}. ${story.subtitle || ''}. ${allChaptersText}`.substring(0, 3000);
    const cacheKey = `${selectedGeminiVoice}_${story.id}_${textToNarrate.length}`;

    // Check cache first for 0ms instant play
    if (ttsAudioCacheRef.current.has(cacheKey)) {
      const cachedSrc = ttsAudioCacheRef.current.get(cacheKey)!;
      const audio = new Audio(cachedSrc);
      naturalAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingNaturalAudio(false);
        naturalAudioRef.current = null;
      };

      await audio.play();
      setIsPlayingNaturalAudio(true);
      return;
    }

    setIsFetchingTTS(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToNarrate, 
          voiceName: selectedGeminiVoice 
        })
      });

      const data = await res.json();
      if (data.audio) {
        const audioSrc = createAudioFromBase64(data.audio, data.mimeType || 'audio/wav');
        ttsAudioCacheRef.current.set(cacheKey, audioSrc);

        const audio = new Audio(audioSrc);
        naturalAudioRef.current = audio;

        audio.onended = () => {
          setIsPlayingNaturalAudio(false);
          naturalAudioRef.current = null;
        };

        audio.onerror = () => {
          setIsPlayingNaturalAudio(false);
          naturalAudioRef.current = null;
          handleToggleSpeech(); // Fallback
        };

        await audio.play();
        setIsPlayingNaturalAudio(true);
      } else {
        handleToggleSpeech(); // Fallback
      }
    } catch (err) {
      console.warn('TTS request failed, falling back to Web Speech API:', err);
      handleToggleSpeech();
    } finally {
      setIsFetchingTTS(false);
    }
  };

  // Chapter Image Regeneration Handler
  const handleRegenerateImage = async (chapterIdx: number) => {
    setGeneratingImageIdx(chapterIdx);
    try {
      const ch = story.chapters[chapterIdx];
      const res = await fetch('/api/generate-chapter-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: ch?.imagePrompt,
          chapterTitle: ch?.chapterTitle,
          storyTitle: story.title
        })
      });

      const data = await res.json();
      if (data.imageUrl) {
        setChapterImages((prev) => ({
          ...prev,
          [chapterIdx]: data.imageUrl
        }));
      }
    } catch (err) {
      console.error('Failed to regenerate chapter image:', err);
    } finally {
      setGeneratingImageIdx(null);
    }
  };

  // Text size classes mapping
  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 1: return 'text-sm leading-relaxed';
      case 2: return 'text-base leading-relaxed sm:text-lg';
      case 3: return 'text-lg leading-relaxed sm:text-xl';
      case 4: return 'text-xl leading-relaxed sm:text-2xl';
      case 5: return 'text-2xl leading-relaxed sm:text-3xl';
      default: return 'text-base leading-relaxed sm:text-lg';
    }
  };

  // Theme helper classes
  const getThemeContainerClass = () => {
    switch (readingTheme) {
      case 'dark':
        return 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl';
      case 'sepia':
        return 'bg-[#fbf4e4] border-[#ebd8ba] text-[#2c2016] shadow-xl';
      default:
        return 'bg-white dark:bg-slate-800 border-purple-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xl';
    }
  };

  const getThemeParagraphClass = () => {
    switch (readingTheme) {
      case 'dark':
        return 'text-slate-200';
      case 'sepia':
        return 'text-[#382b20]';
      default:
        return 'text-slate-800 dark:text-slate-200';
    }
  };

  const getThemeTitleClass = () => {
    switch (readingTheme) {
      case 'dark':
        return 'text-purple-300';
      case 'sepia':
        return 'text-[#722f12]';
      default:
        return 'text-purple-900 dark:text-purple-300';
    }
  };

  // Copy URL Share Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Dynamic Copyright Notice Text according to story content type (Hikaye, Masal, Şiir)
  const contentTypeLower = (story.contentType || 'eser').toLowerCase();
  const copyrightNoticeText = `Bu ${contentTypeLower}, 5846 Sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmakta olup, tüm yayın, dağıtım ve telif hakları münhasıran "Çocukla Okuyoruz" portalına ve eser sahibi Sefa Buran'a aittir. İzin alınmaksızın kopyalanamaz, çoğaltılamaz veya ticari amaçla paylaşılamaz.`;

  // Print & E-Book Export
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Try opening dedicated print window (100% reliable in iFrames/Mobile)
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printableHtml = `
          <!DOCTYPE html>
          <html lang="tr">
          <head>
            <meta charset="UTF-8">
            <title>${story.title} - Çocukla Okuyoruz E-Kitap / Yazdır</title>
            <style>
              @page { size: A4 portrait; margin: 12mm; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background: #ffffff; margin: 0; padding: 20px; line-height: 1.8; }
              .header-box { text-align: center; border-bottom: 3px solid #7c3aed; padding-bottom: 15px; margin-bottom: 25px; }
              .story-title { font-size: 26px; font-weight: 800; color: #5b21b6; margin: 0 0 6px 0; }
              .story-subtitle { font-size: 14px; font-weight: 600; color: #6d28d9; margin: 0 0 10px 0; }
              .badge-row { font-size: 12px; color: #475569; margin-top: 6px; font-weight: 600; }
              .chapter-block { margin-bottom: 30px; page-break-inside: avoid; }
              .chapter-heading { font-size: 18px; font-weight: 800; color: #1e1b4b; border-left: 4px solid #7c3aed; padding-left: 10px; margin-bottom: 12px; }
              .chapter-img { text-align: center; margin: 15px 0; }
              .chapter-img img { max-width: 100%; max-height: 380px; border-radius: 12px; object-fit: cover; display: block; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .paragraph-text { font-size: 15px; color: #334155; margin-bottom: 12px; text-align: justify; text-indent: 12px; white-space: pre-line; }
              .copyright-box { margin-top: 40px; border: 2px solid #f59e0b; background: #fffbeb; padding: 20px; border-radius: 16px; text-align: center; page-break-inside: avoid; }
              .copyright-title { font-size: 13px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
              .copyright-notice { font-size: 12px; color: #92400e; line-height: 1.6; margin-bottom: 10px; font-weight: 500; }
              .author-badge { font-size: 13px; font-weight: 800; color: #78350f; margin-bottom: 12px; }
              .contact-links { border-top: 1px dashed #f59e0b; padding-top: 12px; display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap; font-size: 12px; font-weight: 700; color: #1e293b; }
            </style>
          </head>
          <body>
            <div class="header-box">
              <h1 class="story-title">${story.title}</h1>
              <div class="story-subtitle">${story.subtitle}</div>
              <div class="badge-row">Tür: ${story.contentType} | Yaş Grubu: ${story.childAge || 'Tüm Yaşlar'} | Kahraman: ${story.childName}</div>
            </div>

            ${story.chapters.map((ch, idx) => {
              const imgUrl = chapterImages[idx] || ch.generatedImageUrl || FALLBACK_ILLUSTRATIONS[idx % FALLBACK_ILLUSTRATIONS.length];
              return `
                <div class="chapter-block">
                  ${ch.chapterTitle ? `<div class="chapter-heading">${ch.chapterTitle}</div>` : ''}
                  ${imgUrl ? `<div class="chapter-img"><img src="${imgUrl}" alt="${ch.chapterTitle || story.title} Görseli" referrerpolicy="no-referrer" crossorigin="anonymous" /></div>` : ''}
                  ${ch.paragraphs.map(p => `<p class="paragraph-text">${p}</p>`).join('')}
                </div>
              `;
            }).join('')}

            <div class="copyright-box">
              <div class="copyright-title">🛡️ TELİF HAKLARI VE YASAL KORUMA BİLDİRİMİ (${story.contentType.toUpperCase()})</div>
              <div class="copyright-notice">"${copyrightNoticeText}"</div>
              <div class="author-badge">Eser Sahibi ve Yazılım Geliştiricisi: Sefa Buran — Tüm Hakları Saklıdır.</div>
              <div class="contact-links">
                <span>📧 E-Posta: sefaburan.05@gmail.com</span>
                <span>🐦 X (Twitter): twitter.com/sefaburancom</span>
                <span>📷 Instagram: instagram.com/sefaburancom</span>
              </div>
            </div>

            <script>
              window.onload = function() {
                var imgs = Array.from(document.querySelectorAll('img'));
                if (imgs.length === 0) {
                  window.print();
                  return;
                }
                var loaded = 0;
                function check() {
                  loaded++;
                  if (loaded >= imgs.length) {
                    setTimeout(function() { window.print(); }, 300);
                  }
                }
                imgs.forEach(function(img) {
                  if (img.complete && img.naturalWidth > 0) {
                    check();
                  } else {
                    img.onload = check;
                    img.onerror = check;
                  }
                });
                setTimeout(function() { window.print(); }, 2000);
              };
            </script>
          </body>
          </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printableHtml);
        printWindow.document.close();
        return;
      }
    } catch (err) {
      console.warn('Popup print blocked, falling back to window.print():', err);
    }

    // Fallback: Direct window.print()
    window.focus();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Generate Image for Chapter
  const handleGenerateChapterImage = (chapterIdx: number, prompt: string) => {
    setGeneratingImageIdx(chapterIdx);
    setLoadingImages((prev) => ({ ...prev, [chapterIdx]: true }));

    const cleanPrompt = (prompt || `storybook illustration for ${story.title}`).replace(/[^a-zA-Z0-9 ,]/g, '');
    const seed = Date.now() + chapterIdx * 19;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`children storybook illustration, ${cleanPrompt}, pastel colors, cute art style, 8k`)}?width=800&height=500&nologo=true&seed=${seed}`;

    setChapterImages((prev) => ({ ...prev, [chapterIdx]: imageUrl }));

    setTimeout(() => {
      setLoadingImages((prev) => ({ ...prev, [chapterIdx]: false }));
      setGeneratingImageIdx(null);
    }, 3000);
  };

  // Handle Image Error
  const handleImageError = (chapterIdx: number) => {
    const fallbackUrl = FALLBACK_ILLUSTRATIONS[chapterIdx % FALLBACK_ILLUSTRATIONS.length];
    setChapterImages((prev) => ({ ...prev, [chapterIdx]: fallbackUrl }));
    setLoadingImages((prev) => ({ ...prev, [chapterIdx]: false }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Controls Bar (Hidden in Print) */}
      <div className={`print:hidden rounded-2xl border p-4 shadow-md flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 transition-colors ${
        readingTheme === 'dark'
          ? 'bg-slate-800/95 border-slate-700 text-white backdrop-blur-md'
          : readingTheme === 'sepia'
          ? 'bg-[#f3e5cb]/95 border-[#dfcaa3] text-[#2c2016] backdrop-blur-md'
          : 'bg-white/95 dark:bg-slate-800/95 border-purple-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 backdrop-blur-md'
      }`}>
        
        {/* Back Button */}
        <button
          onClick={onBackToLibrary}
          className="text-xs font-bold flex items-center gap-1 bg-black/5 hover:bg-black/10 px-3 py-2 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kütüphane</span>
        </button>

        {/* Reading Theme Toggle (Okuma Modu - Sepia Tone) */}
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl">
          <button
            onClick={() => setReadingTheme(readingTheme === 'sepia' ? 'light' : 'sepia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              readingTheme === 'sepia' 
                ? 'bg-[#ebd8ba] text-[#2c2016] shadow-sm ring-1 ring-[#cbb48e]' 
                : 'hover:bg-black/5 text-slate-700 dark:text-slate-200'
            }`}
            title="Sıcak kağıt renkli Okuma Modunu Aç/Kapat"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Okuma Modu</span>
          </button>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl">
          <button
            onClick={() => setFontSizeLevel((prev) => Math.max(1, prev - 1))}
            className="w-7 h-7 bg-white/80 dark:bg-slate-700 rounded-lg text-xs font-bold shadow-xs hover:bg-white cursor-pointer"
            title="Metni Küçült"
          >
            A-
          </button>
          <button
            onClick={() => setFontSizeLevel(2)}
            className="px-2 h-7 bg-white/80 dark:bg-slate-700 rounded-lg text-xs font-bold shadow-xs hover:bg-white cursor-pointer"
            title="Varsayılan Boyut"
          >
            Norm
          </button>
          <button
            onClick={() => setFontSizeLevel((prev) => Math.min(5, prev + 1))}
            className="w-7 h-7 bg-white/80 dark:bg-slate-700 rounded-lg text-xs font-bold shadow-xs hover:bg-white cursor-pointer"
            title="Metni Büyüt"
          >
            A+
          </button>
        </div>

        {/* Audio Player, Print & Coloring Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Coloring Book Button */}
          <button
            type="button"
            onClick={() => setShowColoringBook(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            title="Siyah-Beyaz Çizimleri Sayfa Olarak Boya veya Yazdır"
          >
            <Palette className="w-4 h-4 text-slate-950" />
            <span>🎨 Boyama Kitabı</span>
          </button>

          {/* Print / Export PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            title="Görsellerle Yazdır veya E-Kitap (PDF) Olarak Kaydet"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF İndir 🖨️</span>
          </button>

          {/* Natural Human Voice Gemini AI TTS Button */}
          <button
            type="button"
            onClick={handlePlayNaturalTTS}
            disabled={isFetchingTTS}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md ${
              isPlayingNaturalAudio
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 text-slate-950 hover:brightness-110'
            }`}
            title="Doğal ve İnsansı Yapay Zeka Anne/Masalcı Sesi"
          >
            {isFetchingTTS ? (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                <span>Doğal Ses Hazırlanıyor...</span>
              </>
            ) : isPlayingNaturalAudio ? (
              <>
                <Pause className="w-4 h-4 text-white" />
                <span>Doğal Sesi Duraklat</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Doğal Sesle Dinle 🎙️</span>
              </>
            )}
          </button>

          {/* Standard Browser Speech Play/Pause */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isPlayingSpeech && !isPausedSpeech
                ? 'bg-amber-500 text-white shadow-md animate-pulse'
                : 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
            }`}
          >
            {isPlayingSpeech && !isPausedSpeech ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSpeech ? (isPausedSpeech ? 'Devam Et' : 'Duraklat') : 'Tarayıcı Sesi 🔊'}</span>
          </button>

          {/* Stop Speech */}
          {(isPlayingSpeech || isPlayingNaturalAudio) && (
            <button
              type="button"
              onClick={stopSpeech}
              className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition cursor-pointer"
              title="Seslendirmeyi Durdur"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          {/* Voice Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-2 bg-black/5 hover:bg-black/10 rounded-xl transition cursor-pointer"
            title="Ses ve Kadın Sesi Tonu Ayarları"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Favorite */}
          <button
            type="button"
            onClick={() => onToggleFavorite(story.id)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isFavorite
                ? 'bg-pink-50 border-pink-200 text-pink-600'
                : 'border-slate-200 text-slate-400 hover:text-pink-600'
            }`}
            title="Favorilere Ekle"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>

      {/* Voice Settings Expandable Bar */}
      {showVoiceSettings && (
        <div className="print:hidden p-4 bg-purple-50 dark:bg-slate-800 rounded-2xl border border-purple-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-purple-600" />
              <span>Kadın Sesi ve Okuma Ayarları</span>
            </h4>
            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
              Anne Sesi Anlatım
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Voice Dropdown */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Ses Sanatçısı Seçimi:</label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 text-xs"
              >
                {availableVoices.map((v) => {
                  const nameLower = v.name.toLowerCase();
                  const isFemale = nameLower.includes('yelda') || nameLower.includes('zeynep') || nameLower.includes('seda') || nameLower.includes('gül') || nameLower.includes('hazal') || nameLower.includes('fatma') || nameLower.includes('filiz') || nameLower.includes('deniz') || nameLower.includes('female');
                  return (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {isFemale ? '👩 ' : '👤 '}{v.name} ({v.lang})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Female Voice Pitch Level */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Ses Tonu (Pitch):</label>
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setSpeechPitch(1.0)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${speechPitch === 1.0 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  Doğal
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechPitch(1.25)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${speechPitch === 1.25 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  Yumuşak Kadın
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechPitch(1.4)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${speechPitch === 1.4 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  İnce Anne Sesi
                </button>
              </div>
            </div>

            {/* Speech Rate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Okuma Hızı:</label>
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                  {speechRate.toFixed(1)}x {speechRate === 1.0 ? '(İdeal)' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setSpeechRate(0.8)}
                  className={`px-2 py-1 rounded-lg font-bold text-xs cursor-pointer ${speechRate === 0.8 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  0.8x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${speechRate === 1.0 ? 'bg-purple-600 text-white shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  1.0x (İdeal)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.2)}
                  className={`px-2 py-1 rounded-lg font-bold text-xs cursor-pointer ${speechRate === 1.2 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border'}`}
                >
                  1.2x
                </button>
              </div>

              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-purple-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 mt-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Container */}
      <article className={`rounded-3xl border p-6 sm:p-10 transition-colors ${getThemeContainerClass()}`}>
        
        {/* Title & Meta Header */}
        <header className="space-y-3 pb-6 border-b border-black/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {story.contentType}
            </span>
            {story.childAge && (
              <span className="bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                {story.childAge}
              </span>
            )}
            <span className="bg-black/5 text-current text-xs font-bold px-3 py-1 rounded-full border border-black/10">
              {story.category}
            </span>
            <span className="text-emerald-700 bg-emerald-100 text-xs font-bold ml-auto px-3 py-1 rounded-full border border-emerald-200 print:hidden">
              ⏱️ {story.readingTime}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-black leading-tight ${readingTheme === 'dark' ? 'text-white' : ''}`}>
            {story.title}
          </h1>

          <div className="flex items-center justify-between text-xs opacity-80 pt-1">
            <p className="italic font-serif text-sm">
              "{story.subtitle}"
            </p>
            <span className="shrink-0 font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2.5 py-1 rounded-lg border border-purple-500/20">
              Kahraman: {story.childName}
            </span>
          </div>
        </header>

        {/* Chapters Content */}
        <div className="space-y-6">
          {story.chapters.map((chapter, cIdx) => {
            const currentImg = chapterImages[cIdx] || FALLBACK_ILLUSTRATIONS[cIdx % FALLBACK_ILLUSTRATIONS.length];
            const isGeneratingThis = generatingImageIdx === cIdx;
            const isLoadingThis = loadingImages[cIdx];
            const isPoetry = story.contentType === 'Şiir';

            return (
              <section key={cIdx} className="space-y-4">
                
                {/* Ultra Subtle, Soft Chapter Transition (Belli Belirsiz, Gözü Tırmalamayan) */}
                {!isPoetry && cIdx > 0 && (
                  <div className="flex items-center justify-center gap-3 my-6 opacity-40">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent" />
                    <span className="text-xs text-purple-400 dark:text-purple-500 font-serif">✦</span>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent" />
                  </div>
                )}

                {/* Chapter Illustration Box */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-black/5 shadow-sm group">
                  
                  {/* Image Element */}
                  <img
                    src={currentImg}
                    alt={chapter.chapterTitle || `${story.title} Görseli`}
                    onLoad={() => setLoadingImages((prev) => ({ ...prev, [cIdx]: false }))}
                    onError={() => handleImageError(cIdx)}
                    className="w-full h-auto max-h-[400px] object-cover block transition-opacity duration-300"
                  />

                  {/* Loading overlay when regenerating */}
                  {(isGeneratingThis || isLoadingThis) && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 p-6 text-center text-white print:hidden">
                      <Sparkles className="w-8 h-8 text-amber-300 animate-bounce" />
                      <p className="text-xs font-bold">
                        Özel İllüstrasyon Yükleniyor...
                      </p>
                    </div>
                  )}

                  {/* Regenerate Action Floating Bar (Hidden in Print) */}
                  <div className="p-2.5 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-white print:hidden">
                    <span className="text-[11px] font-bold flex items-center gap-1 opacity-90">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                      Yapay Zeka Çizimi
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRegenerateImage(cIdx)}
                      disabled={isGeneratingThis}
                      className="text-slate-900 bg-amber-300 hover:bg-amber-400 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-purple-800" />
                      <span>{isGeneratingThis ? 'Gemini AI Çiziyor...' : 'Görseli Yeniden Üret 🎨'}</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Paragraphs / Poetry Stanzas */}
                <div className="space-y-4 pt-1">
                  {chapter.paragraphs.map((para, pIdx) => {
                    if (isPoetry) {
                      return (
                        <div 
                          key={pIdx}
                          className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-purple-200 dark:border-slate-700 shadow-xs font-serif text-slate-900 dark:text-slate-100"
                        >
                          <p className="whitespace-pre-line text-base sm:text-xl font-serif font-semibold leading-relaxed tracking-wide text-slate-900 dark:text-slate-100 pl-4 border-l-4 border-purple-600 dark:border-purple-400">
                            {para}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <p key={pIdx} className={`${getThemeParagraphClass()} ${getFontSizeClass()}`}>
                        {para}
                      </p>
                    );
                  })}
                </div>

                {/* Inter-chapter Ad Banner Placement (Hidden in Print) */}
                {cIdx < story.chapters.length - 1 && (
                  <AdSenseUnit slot="8194377456" label="Google AdSense" />
                )}

              </section>
            );
          })}
        </div>

        {/* 📜 "Bunu Biliyor Muydunuz?" (Tarihte Yaşanmış Gerçek Olay Bilgisi) */}
        {story.historicalFact && (
          <div className="mt-10 p-6 sm:p-7 bg-amber-100/90 dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-500 rounded-3xl space-y-3 shadow-md">
            <h4 className="font-black text-sm uppercase tracking-wider text-amber-950 dark:text-amber-300 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Bunu Biliyor Muydunuz? (Tarihten Bir Yaprak) 📜</span>
            </h4>
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-900 dark:text-amber-100">
              {story.historicalFact}
            </p>
          </div>
        )}

        {/* 🌱 "Düşünelim & Sohbet Edelim" Questions */}
        {story.reflectionQuestions && story.reflectionQuestions.length > 0 && (
          <div className="mt-8 p-6 sm:p-7 bg-indigo-100/90 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-600 rounded-3xl space-y-3 shadow-md">
            <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-indigo-950 dark:text-indigo-300 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-700 dark:text-indigo-400 shrink-0" />
              <span>Düşünelim & Sohbet Edelim (Ebeveyn ve Çocuk) 🌱</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-base font-semibold text-slate-900 dark:text-indigo-100">
              {story.reflectionQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-400 shrink-0">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 📖 Minik Kelime Sözlüğü */}
        {story.miniGlossary && story.miniGlossary.length > 0 && (
          <div className="mt-8 p-6 sm:p-7 bg-emerald-100/90 dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-600 rounded-3xl space-y-3 shadow-md">
            <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Minik Kelime Sözlüğü 📖</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {story.miniGlossary.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-1 shadow-xs">
                  <span className="font-black text-emerald-800 dark:text-emerald-400 block text-xs sm:text-sm">{item.term}</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moral Lesson Footer */}
        {story.moralMessage && (
          <div className="mt-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl border-2 border-amber-300 dark:border-slate-700 text-amber-950 dark:text-amber-200 space-y-1">
            <h4 className="font-black text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              💡 {story.contentType}'ın Ana Fikri (Pedagojik Mesaj)
            </h4>
            <p className="text-xs sm:text-sm font-semibold">
              {story.moralMessage}
            </p>
          </div>
        )}

        {/* 🎓 Minik Okur Başarı Sertifikası & Rozeti */}
        <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-purple-950/40 dark:to-slate-900 border-2 border-amber-400/80 dark:border-amber-500/80 rounded-3xl text-center space-y-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 rounded-2xl shadow-md inline-flex items-center justify-center">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Tebrikler Minik Okur! 🌟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-md">
              Bu {story.contentType.toLowerCase()} eserini başarıyla okuyup tamamladın. Özel Başarı Sertifikanı almak ister misin?
            </p>
          </div>

          {!showCertificate ? (
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition cursor-pointer inline-flex items-center gap-2.5"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>🏅 Minik Okur Başarı Sertifikamı Gör & İndir</span>
            </button>
          ) : (
            <div className="space-y-6 pt-2">
              {/* Printable Official Certificate Document Card */}
              <div className="p-6 sm:p-10 bg-amber-50/90 dark:bg-slate-900 border-8 border-double border-amber-400 dark:border-amber-500 rounded-3xl text-center space-y-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
                
                {/* Certificate Ribbon Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-black tracking-widest uppercase">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Çocukla Okuyoruz — Resmi Başarı Belgesi</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black font-serif text-amber-900 dark:text-amber-300 tracking-wide">
                    MİNİK OKUR BAŞARI SERTİFİKASI
                  </h2>
                </div>

                {/* Recipient Name */}
                <div className="space-y-1 py-2 border-y border-amber-300/60 dark:border-amber-700/60 max-w-lg mx-auto">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Bu Belge Gururla Sunulur:</span>
                  <h1 className="text-2xl sm:text-4xl font-black font-serif text-purple-900 dark:text-purple-300">
                    {story.childName ? story.childName : 'Değerli Minik Okurumuz'}
                  </h1>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-200 max-w-xl mx-auto">
                  "<span className="font-bold text-amber-800 dark:text-amber-300">{story.title}</span>" başlıklı {story.contentType.toLowerCase()} eserini büyük bir merak, dikkat ve gayretle okuyup tamamlayarak milli ve manevi değerlerimizi öğrenme yolunda önemli bir adım atmıştır.
                </p>

                {/* Badges / Medals Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 rounded-2xl flex flex-col items-center space-y-1 shadow-xs">
                    <Medal className="w-6 h-6 text-amber-500" />
                    <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300">Günün Okuru</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Üstün Gayret</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 rounded-2xl flex flex-col items-center space-y-1 shadow-xs">
                    <Star className="w-6 h-6 text-purple-500" />
                    <span className="font-extrabold text-xs text-purple-900 dark:text-purple-300">Kitap Kaşifi</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Meraklı Minik</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 rounded-2xl flex flex-col items-center space-y-1 shadow-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-300">Gönül Dostu</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Erdemli Karakter</span>
                  </div>
                </div>

                {/* Footer Signature & Date */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 border-t border-amber-300/60 dark:border-amber-700/60">
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 uppercase">Tarih:</span>
                    <span>{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase">Onaylayan & Eser Sahibi:</span>
                    <span className="font-serif font-black text-slate-900 dark:text-white">Sefa Buran (Yayın Kurulu)</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Sertifikayı Yazdır / PDF İndir 🖨️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="px-5 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm transition cursor-pointer"
                >
                  Gizle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 📲 Sosyal Medyada Paylaş Butonları (Hidden in Print) */}
        <div className="mt-10 p-6 bg-purple-50/80 dark:bg-slate-800/80 border border-purple-200 dark:border-slate-700 rounded-3xl space-y-4 text-center print:hidden">
          <div className="space-y-1">
            <h4 className="font-black text-xs uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center justify-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Bu Eseri Sevdiklerinizle Paylaşın 📲</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Çocuklarımızın milli ve manevi değerlerimizle yetişmesine katkı sağlamak için sosyal medyada paylaşabilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`" ${story.title} " - Çocuklarımız için harika bir ${story.contentType.toLowerCase()}! Okumak için tıkla: ` + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>💬 WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`" ${story.title} " - Çocuklarımız için özel ${story.contentType.toLowerCase()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>✈️ Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>📘 Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`" ${story.title} " - Çocuklarımız için harika bir ${story.contentType.toLowerCase()}`)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>🐦 X (Twitter)</span>
            </a>

            {/* Link Kopyala */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Bağlantı Kopyalandı! 📋' : 'Bağlantıyı Kopyala 🔗'}</span>
            </button>
          </div>
        </div>

        {/* Main Site & Print Official Legal Notice Footer (ONLY 1 prominent time at bottom) */}
        <div className="mt-10 p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl space-y-4 text-center shadow-xl border-2 border-amber-400">
          <div className="inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <ShieldAlert className="w-4 h-4 text-slate-950" />
            <span>Telif Hakları ve Yasal Koruma Bildirimi ({story.contentType.toUpperCase()})</span>
          </div>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-2xl mx-auto">
            "{copyrightNoticeText}"
          </p>
          
          <div className="text-xs text-amber-300 font-extrabold pt-1 tracking-wide">
            Eser Sahibi ve Yazılım Geliştiricisi: Sefa Buran — Tüm Hakları Saklıdır.
          </div>

          {/* Sefa Buran Official Contact Badges */}
          <div className="pt-2 border-t border-purple-800/80 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <a
              href="mailto:sefaburan.05@gmail.com"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-rose-200 rounded-xl border border-white/10 transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>sefaburan.05@gmail.com</span>
            </a>

            <a
              href="https://twitter.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sky-200 rounded-xl border border-white/10 transition flex items-center gap-1.5"
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>twitter.com/sefaburancom</span>
            </a>

            <a
              href="https://instagram.com/sefaburancom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-pink-200 rounded-xl border border-white/10 transition flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>instagram.com/sefaburancom</span>
            </a>
          </div>
        </div>

        {/* Recommended Similar Stories for Continuous Endless Reading */}
        {recommendedStories.length > 0 && onSelectStory && (
          <div className="mt-10 pt-8 border-t border-purple-200 dark:border-slate-800 space-y-5 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    İlgini Çekebilecek Diğer {story.contentType || 'Eser'}ler
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Sınırsız okuma keyfi için çocuklarınıza özel seçilen diğer eserler
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onBackToLibrary}
                className="text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer hidden sm:block"
              >
                Tüm Kütüphane →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedStories.map((rec) => {
                const coverImg = rec.chapters?.[0]?.generatedImageUrl || FALLBACK_ILLUSTRATIONS[0];
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      onSelectStory(rec);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={coverImg}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-purple-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-xs">
                        {rec.contentType}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition line-clamp-1">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                          {rec.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <span>{rec.childAge || 'Tüm Yaşlar'}</span>
                        <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition flex items-center gap-0.5">Oku →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </article>

      {/* Coloring Book Modal */}
      {showColoringBook && (
        <ColoringBook
          story={story}
          onClose={() => setShowColoringBook(false)}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          story={story}
          onClose={() => setShowCertificate(false)}
        />
      )}

    </div>
  );
};
