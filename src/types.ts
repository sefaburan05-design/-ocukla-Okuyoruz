export interface Chapter {
  chapterTitle: string;
  paragraphs: string[];
  imagePrompt: string;
  generatedImageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface MiniGlossaryItem {
  term: string;
  meaning: string;
}

export interface Story {
  id: string;
  contentType: 'Masal' | 'Hikaye' | 'Şiir';
  title: string;
  subtitle: string;
  childName: string;
  childAge?: string;
  readingTime: string;
  category: string;
  moralMessage: string;
  historicalFact?: string; // Bunu Biliyor Muydunuz? - Tarihi Gerçek Olay
  reflectionQuestions?: string[]; // Düşünelim & Sohbet Edelim Soruları
  miniGlossary?: MiniGlossaryItem[]; // Minik Kelime Sözlüğü
  createdAt: string;
  views: number;
  chapters: Chapter[];
}

export interface StoryFormData {
  contentType: 'Masal' | 'Hikaye' | 'Şiir';
  childName: string;
  childAge: string;
  heroes: string;
  location: string;
  genre: string;
  specialDetails: string;
}

export interface AdPlacement {
  id: string;
  title: string;
  description: string;
  brand: string;
  ctaText: string;
  badge: string;
  imageUrl?: string;
  priceTag?: string;
}

