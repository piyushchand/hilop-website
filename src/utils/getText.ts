interface MultilingualText {
  en: string;
  hi: string;
}

export function getText(text: MultilingualText | string, language: string): string {
  if (typeof text === 'string') return text;
  return text[language as keyof MultilingualText] || text.en || '';
} 