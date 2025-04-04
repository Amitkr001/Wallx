import { UNSPLASH_ACCESS_KEY } from '@env';

const BASE_URL = 'https://api.unsplash.com';

export const searchWallpapers = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/photos?query=${query}&page=${page}&per_page=20`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    throw error;
  }
};

export const getRandomWallpapers = async (count = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/photos/random?count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching random wallpapers:', error);
    throw error;
  }
}; 