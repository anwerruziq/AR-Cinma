import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Language state (ar = Arabic, en = English)
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'ar';
    });

    // Favorites state
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : { movies: [], tv: [] };
    });

    // Update localStorage when language changes
    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    }, [language]);

    // Update localStorage when favorites change
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Toggle language
    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    // Get TMDB language code
    const getApiLanguage = () => {
        return language === 'ar' ? 'ar-SA' : 'en-US';
    };

    // Add to favorites
    const addToFavorites = (item, mediaType) => {
        setFavorites(prev => {
            const key = mediaType === 'movie' ? 'movies' : 'tv';
            const list = prev?.[key] || [];
            const exists = list.some(fav => fav.id === item.id);
            if (exists) return prev;
            return {
                ...prev,
                movies: prev?.movies || [],
                tv: prev?.tv || [],
                [key]: [...list, { ...item, mediaType }],
            };
        });
    };

    // Remove from favorites
    const removeFromFavorites = (id, mediaType) => {
        setFavorites(prev => {
            const key = mediaType === 'movie' ? 'movies' : 'tv';
            const list = prev?.[key] || [];
            return {
                ...prev,
                movies: prev?.movies || [],
                tv: prev?.tv || [],
                [key]: list.filter(item => item.id !== id),
            };
        });
    };

    // Check if item is in favorites
    const isFavorite = (id, mediaType) => {
        const key = mediaType === 'movie' ? 'movies' : 'tv';
        const list = favorites?.[key] || [];
        return list.some(item => item.id === id);
    };

    // Toggle favorite
    const toggleFavorite = (item, mediaType) => {
        if (isFavorite(item.id, mediaType)) {
            removeFromFavorites(item.id, mediaType);
        } else {
            addToFavorites(item, mediaType);
        }
    };

    // Translations
    const translations = {
        ar: {
            home: 'الرئيسية',
            movies: 'أفلام',
            tvShows: 'مسلسلات',
            favorites: 'المفضلة',
            search: 'بحث...',
            trending: 'الرائج الآن',
            popular: 'الأكثر شعبية',
            topRated: 'الأعلى تقييماً',
            watchNow: 'شاهد الآن',
            moreInfo: 'المزيد',
            noResults: 'لا توجد نتائج',
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
            genre: 'التصنيف',
            year: 'السنة',
            rating: 'التقييم',
            allGenres: 'جميع التصنيفات',
            allYears: 'جميع السنوات',
            cast: 'طاقم العمل',
            trailer: 'العرض الدعائي',
            similar: 'مشابه',
            overview: 'القصة',
            releaseDate: 'تاريخ الإصدار',
            runtime: 'المدة',
            minutes: 'دقيقة',
            episodes: 'حلقات',
            seasons: 'مواسم',
            noFavorites: 'لا توجد عناصر في المفضلة',
            addedToFavorites: 'تمت الإضافة للمفضلة',
            removedFromFavorites: 'تمت الإزالة من المفضلة',
            anime: 'أنمي',
            showEpisodes: 'عرض الحلقات',
            hideEpisodes: 'إخفاء الحلقات',
        },
        en: {
            home: 'Home',
            movies: 'Movies',
            tvShows: 'TV Shows',
            favorites: 'Favorites',
            search: 'Search...',
            trending: 'Trending Now',
            popular: 'Popular',
            topRated: 'Top Rated',
            watchNow: 'Watch Now',
            moreInfo: 'More Info',
            noResults: 'No results found',
            loading: 'Loading...',
            error: 'An error occurred',
            genre: 'Genre',
            year: 'Year',
            rating: 'Rating',
            allGenres: 'All Genres',
            allYears: 'All Years',
            cast: 'Cast',
            trailer: 'Trailer',
            similar: 'Similar',
            overview: 'Overview',
            releaseDate: 'Release Date',
            runtime: 'Runtime',
            minutes: 'min',
            episodes: 'Episodes',
            seasons: 'Seasons',
            noFavorites: 'No favorites yet',
            addedToFavorites: 'Added to favorites',
            removedFromFavorites: 'Removed from favorites',
            anime: 'Anime',
            showEpisodes: 'Show Episodes',
            hideEpisodes: 'Hide Episodes',
        },
    };

    // Get translation
    const t = (key) => translations[language]?.[key] || key;

    const value = {
        language,
        toggleLanguage,
        getApiLanguage,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        t,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
