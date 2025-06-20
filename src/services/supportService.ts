import apiClient from '@/lib/api';
import { 
  SupportCategoriesResponse, 
  SupportCategoryDetailsResponse,
  SupportSearchResponse
} from '@/types/support';

export const getSupportCategories = async (): Promise<SupportCategoriesResponse> => {
  return apiClient.requestPublic<SupportCategoriesResponse>('/help-support', { method: 'GET' });
};

export const getSupportCategoryById = async (id: string): Promise<SupportCategoryDetailsResponse> => {
  return apiClient.requestPublic<SupportCategoryDetailsResponse>(`/help-support/${id}`, { method: 'GET' });
};

export const searchSupport = async (query: string): Promise<SupportSearchResponse> => {
  if (!query) {
    // Or handle as you see fit, maybe return a default empty state
    return Promise.resolve({ success: true, count: 0, data: [] });
  }
  return apiClient.requestPublic<SupportSearchResponse>(`/help-support/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
}; 