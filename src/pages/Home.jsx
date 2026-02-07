import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTrending, fetchPopular, fetchTopRated } from '../services/tmdbApi';
import Slider from '../components/Slider/Slider';
import MovieCard from '../components/MovieCard/MovieCard';
import { CardSkeleton } from '../components/Loader/Loader';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const MovieRow = ({ title, items, loading, mediaType }) => {
    const { language } = useApp();

    const scroll = (direction) => {
        const container = document.getElementById(`row-${title.replace(/\s/g, '')}`);
        if (container) {
            // In RTL, positive scrollLeft scrolls right (to the next items)
            // In LTR, positive scrollLeft scrolls right (to the next items)
            // But container.scrollBy({ left: ... }) handles this based on dir
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group py-4">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-8 border-s-4 border-accent-cyan flex items-center gap-3">
                {title}
            </h2>

            <div className="relative">
                {/* Scroll Buttons - Using logical positioning */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-gradient-to-e from-primary to-transparent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <BiChevronLeft size={24} className="rtl:rotate-180" />
                </button>

                <button
                    onClick={() => scroll('right')}
                    className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-gradient-to-s from-primary to-transparent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <BiChevronRight size={24} className="rtl:rotate-180" />
                </button>

                {/* Cards Container - Logical spacing and automatic direction */}
                <div
                    id={`row-${title.replace(/\s/g, '')}`}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-36 md:w-44">
                                <CardSkeleton />
                            </div>
                        ))
                    ) : (
                        items?.map((item) => (
                            <div key={item.id} className="flex-shrink-0 w-36 md:w-44" style={{ scrollSnapAlign: 'start' }}>
                                <MovieCard item={item} mediaType={mediaType || item.media_type} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const { t, getApiLanguage, language } = useApp();
    const [trending, setTrending] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTV, setPopularTV] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [trendingData, popularMoviesData, popularTVData, topRatedData, animeData] = await Promise.all([
                    fetchTrending('all', 'week', getApiLanguage()),
                    fetchPopular('movie', getApiLanguage()),
                    fetchPopular('tv', getApiLanguage()),
                    fetchTopRated('movie', getApiLanguage()),
                    import('../services/tmdbApi').then(m => m.fetchAnime(getApiLanguage())),
                ]);

                setTrending(trendingData.results || []);
                setPopularMovies(popularMoviesData.results || []);
                setPopularTV(popularTVData.results || []);
                setTopRatedMovies(topRatedData.results || []);
                setAnime(animeData.results || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getApiLanguage, language]);

    return (
        <div className="min-h-screen bg-primary">
            {/* Hero Slider */}
            <Slider items={trending.slice(0, 8)} loading={loading} />

            {/* Content Sections */}
            <div className="relative z-10 -mt-20 space-y-8 pb-12">
                <MovieRow
                    title={t('trending')}
                    items={trending}
                    loading={loading}
                />

                <MovieRow
                    title={t('anime')}
                    items={anime}
                    loading={loading}
                    mediaType="tv"
                />

                <MovieRow
                    title={t('popular') + ' - ' + t('movies')}
                    items={popularMovies}
                    loading={loading}
                    mediaType="movie"
                />

                <MovieRow
                    title={t('popular') + ' - ' + t('tvShows')}
                    items={popularTV}
                    loading={loading}
                    mediaType="tv"
                />

                <MovieRow
                    title={t('topRated')}
                    items={topRatedMovies}
                    loading={loading}
                    mediaType="movie"
                />
            </div>
        </div>
    );
};

export default Home;
