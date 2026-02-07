import axios from 'axios';
import { mockTrending, mockMovies, mockTVShows, mockGenres, mockDetails } from './mockData';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Check if we have a valid API key
const USE_MOCK_DATA = !API_KEY || API_KEY === 'your_api_key_here';

if (USE_MOCK_DATA) {
    console.log('⚠️ No TMDB API key found. Using mock data for demo.');
    console.log('📝 To use real data, add your TMDB API key to .env file:');
    console.log('   VITE_TMDB_API_KEY=your_actual_api_key');
}

// Image sizes
export const POSTER_SIZES = {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
};

export const BACKDROP_SIZES = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
};

// Create axios instance
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

// Helper to get image URL
export const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API endpoints with mock data fallback
export const fetchTrending = async (mediaType = 'all', timeWindow = 'week', language = 'en-US', page = 1) => {
    if (USE_MOCK_DATA) {
        return mockTrending;
    }
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
        params: { language, page },
    });
    return response.data;
};

export const fetchPopular = async (mediaType = 'movie', language = 'en-US', page = 1) => {
    if (USE_MOCK_DATA) {
        return mediaType === 'movie' ? mockMovies : mockTVShows;
    }
    const endpoint = mediaType === 'movie' ? '/movie/popular' : '/tv/popular';
    const response = await tmdbApi.get(endpoint, {
        params: { language, page },
    });
    return response.data;
};

export const fetchTopRated = async (mediaType = 'movie', language = 'en-US', page = 1) => {
    if (USE_MOCK_DATA) {
        return mediaType === 'movie' ? mockMovies : mockTVShows;
    }
    const endpoint = mediaType === 'movie' ? '/movie/top_rated' : '/tv/top_rated';
    const response = await tmdbApi.get(endpoint, {
        params: { language, page },
    });
    return response.data;
};

export const fetchDetails = async (mediaType, id, language = 'en-US') => {
    if (USE_MOCK_DATA) {
        // Return mock details with the requested ID
        return { ...mockDetails, id: parseInt(id), media_type: mediaType };
    }
    const response = await tmdbApi.get(`/${mediaType}/${id}`, {
        params: {
            language,
            append_to_response: 'credits,videos,similar,recommendations',
        },
    });

    // Fallback for trailers: If no videos found in the requested language, 
    // try to fetch them in English
    if (language !== 'en-US' && (!response.data.videos?.results || response.data.videos.results.length === 0)) {
        try {
            const engVideosResponse = await tmdbApi.get(`/${mediaType}/${id}/videos`, {
                params: { language: 'en-US' }
            });
            response.data.videos = engVideosResponse.data;
        } catch (error) {
            console.error('Error fetching English fallback videos:', error);
        }
    }

    return response.data;
};

export const fetchSearch = async (query, mediaType = 'multi', language = 'en-US', page = 1) => {
    if (USE_MOCK_DATA) {
        // Filter mock data based on query
        const allItems = [...mockMovies.results, ...mockTVShows.results];
        const filtered = allItems.filter(item =>
            (item.title?.toLowerCase().includes(query.toLowerCase())) ||
            (item.name?.toLowerCase().includes(query.toLowerCase())) ||
            (item.overview?.toLowerCase().includes(query.toLowerCase()))
        );
        return {
            results: filtered.map(item => ({
                ...item,
                media_type: item.first_air_date ? 'tv' : 'movie'
            })),
            total_pages: 1,
            page: 1,
        };
    }
    const endpoint = mediaType === 'multi' ? '/search/multi' : `/search/${mediaType}`;
    const response = await tmdbApi.get(endpoint, {
        params: { query, language, page },
    });
    return response.data;
};

export const fetchGenres = async (mediaType = 'movie', language = 'en-US') => {
    if (USE_MOCK_DATA) {
        return mockGenres;
    }
    const response = await tmdbApi.get(`/genre/${mediaType}/list`, {
        params: { language },
    });
    return response.data.genres;
};

export const fetchDiscover = async (mediaType = 'movie', options = {}) => {
    if (USE_MOCK_DATA) {
        const data = mediaType === 'movie' ? mockMovies : mockTVShows;
        const { genres, year } = options;

        let filtered = [...data.results];

        // Simple filtering for demo
        if (year) {
            filtered = filtered.filter(item => {
                const releaseYear = (item.release_date || item.first_air_date)?.split('-')[0];
                return releaseYear === year.toString();
            });
        }

        return {
            results: filtered,
            total_pages: data.total_pages,
            page: options.page || 1,
        };
    }

    const { language = 'en-US', page = 1, genres, year, sortBy = 'popularity.desc', voteAverage } = options;

    const params = {
        language,
        page,
        sort_by: sortBy,
    };

    if (genres) params.with_genres = genres;
    if (year) {
        if (mediaType === 'movie') {
            params.primary_release_year = year;
        } else {
            params.first_air_date_year = year;
        }
    }
    if (voteAverage) params['vote_average.gte'] = voteAverage;

    const response = await tmdbApi.get(`/discover/${mediaType}`, { params });
    return response.data;
};

export const fetchAnime = async (language = 'en-US', page = 1) => {
    if (USE_MOCK_DATA) {
        return mockTVShows; // Fallback to mock TV shows for anime demo
    }
    // Anime is typically TV shows with Animation genre (16) and Original Language Japanese (ja)
    const response = await tmdbApi.get('/discover/tv', {
        params: {
            language,
            page,
            with_genres: '16',
            with_original_language: 'ja',
            sort_by: 'popularity.desc'
        },
    });
    return response.data;
};

export const fetchVideos = async (mediaType, id, language = 'en-US') => {
    if (USE_MOCK_DATA) {
        return mockDetails.videos.results;
    }
    const response = await tmdbApi.get(`/${mediaType}/${id}/videos`, {
        params: { language },
    });
    return response.data.results;
};

export const fetchSeasonDetails = async (tvId, seasonNumber, language = 'en-US') => {
    if (USE_MOCK_DATA) {
        return {
            episodes: Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                name: `Episode ${i + 1}`,
                overview: 'هذا مجرد وصف تجريبي للحلقة من قاعدة البيانات الافتراضية للتعرف على شكل الحلقات في الموقع.',
                air_date: '2023-01-01',
                episode_number: i + 1,
                still_path: null,
                vote_average: 8.5,
                runtime: 24
            }))
        };
    }
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`, {
        params: { language },
    });
    return response.data;
};

export default tmdbApi;
