import { apiClient } from './config';

export interface CreateRatingRequest {
  bookingId: string;
  score: number;
  review: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  score: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

class RatingsService {
  async createRating(ratingData: CreateRatingRequest): Promise<Rating> {
    try {
      const response = await apiClient.post<Rating>('/ratings', ratingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create rating');
    }
  }
}

export const ratingsService = new RatingsService();