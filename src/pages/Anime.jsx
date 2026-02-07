import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAnime } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard/MovieCard';
import Pagination from '../components/Pagination/Pagination';
import Loader, { CardSkeleton } from '../components/Loader/Loader';

const Anime = () => {
    const { t, getApiLanguage, language } = useApp();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadAnime = async () => {
            setLoading(true);
            try {
                const data = await fetchAnime(getApiLanguage(), page);
                setItems(data.results || []);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error('Error loading anime:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAnime();
        window.scrollTo(0, 0);
    }, [getApiLanguage, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="min-h-screen bg-primary pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {t('anime')}
                        </h1>
                        <p className="text-gray-400">
                            {language === 'ar' ? 'اكتشف أفضل مسلسلات الأنمي اليابانية' : 'Discover the best Japanese Anime series'}
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {items.map((item) => (
                                <MovieCard key={item.id} item={item} mediaType="tv" />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">{t('noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Anime;
