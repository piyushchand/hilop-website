export interface SupportCategory {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
}

export interface Faq {
  _id: string;
  question: {
    en: string;
    hi: string;
  };
  answer: {
    en: string;
    hi: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportCategoryDetails {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
  faqs: Faq[];
}

export interface SupportCategoriesResponse {
  success: boolean;
  count: number;
  data: SupportCategory[];
}

export interface SupportCategoryDetailsResponse {
  success: boolean;
  data: SupportCategoryDetails;
}

export interface SupportSearchResult {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
  matching_faqs: Faq[];
}

export interface SupportSearchResponse {
  success: boolean;
  count: number;
  data: SupportSearchResult[];
} 