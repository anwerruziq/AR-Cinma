import { useState } from 'react';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard/MovieCard';
import { BiHeart, BiMovie, BiTv } from 'react-icons/bi';

const Favorites = () => {
    const { t, favorites, language } = useApp();
    const [activeTab, setActiveTab] = useState('movies');

    // Safely get favorites with defaults
    const moviesFavorites = favorites?.movies || [];
    const tvFavorites = favorites?.tv || [];

    const tabs = [
        { id: 'movies', label: t('movies'), icon: BiMovie, count: moviesFavorites.length },
        { id: 'tv', label: t('tvShows'), icon: BiTv, count: tvFavorites.length },
    ];

    const currentItems = activeTab === 'movies' ? moviesFavorites : tvFavorites;

    return (
        <div className="min-h-screen bg-primary pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                        <BiHeart className="text-accent-cyan" size={24} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {t('favorites')}
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.4)]'
                                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-dark-100'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {currentItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {currentItems.map((item) => (
                            <MovieCard
                                key={item.id}
                                item={item}
                                mediaType={activeTab === 'movies' ? 'movie' : 'tv'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 rounded-full bg-dark-200 flex items-center justify-center mb-6 border border-dark-100">
                            <BiHeart className="text-gray-700" size={40} />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            {t('noFavorites')}
                        </h2>
                        <p className="text-gray-500 max-w-md">
                            {language === 'ar'
                                ? 'ابدأ بإضافة الأفلام والمسلسلات المفضلة لديك بالنقر على أيقونة القلب'
                                : 'Start adding your favorite movies and TV shows by clicking the heart icon'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
