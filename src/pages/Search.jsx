import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchSearch } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard/MovieCard';
import Pagination from '../components/Pagination/Pagination';
import { CardSkeleton } from '../components/Loader/Loader';
import { BiSearch } from 'react-icons/bi';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t, getApiLanguage, language } = useApp();

    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('multi');

    const filters = [
        { value: 'multi', label: language === 'ar' ? 'الكل' : 'All' },
        { value: 'movie', label: language === 'ar' ? 'أفلام' : 'Movies' },
        { value: 'tv', label: language === 'ar' ? 'مسلسلات' : 'TV Shows' },
    ];

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const data = await fetchSearch(query, filter, getApiLanguage(), page);
                // Filter out people from multi search
                const filtered = data.results?.filter(item => item.media_type !== 'person') || [];
                setResults(filtered);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        };

        search();
    }, [query, filter, page, getApiLanguage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery.trim() });
            setPage(1);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-primary pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                        {language === 'ar' ? 'ابحث عن أفلام ومسلسلات' : 'Search Movies & TV Shows'}
                    </h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search')}
                            className="w-full px-6 py-4 pr-14 bg-dark-200 border border-dark-100 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 transition-all shadow-xl focus:shadow-accent-cyan/5"
                        />
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center text-white hover:bg-accent-cyan/80 transition-colors shadow-[0_0_15px_rgba(255,75,31,0.3)]"
                        >
                            <BiSearch size={20} />
                        </button>
                    </form>

                    {/* Filter Tabs */}
                    {query && (
                        <div className="flex justify-center gap-2 mt-6">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => { setFilter(f.value); setPage(1); }}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === f.value
                                        ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.4)]'
                                        : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                {!query ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-gray-400 text-lg">
                            {language === 'ar' ? 'ابدأ البحث عن أفلامك المفضلة' : 'Start searching for your favorite movies'}
                        </p>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <p className={`text-gray-400 mb-6 ${language === 'ar' ? 'text-right' : ''}`}>
                            {language === 'ar'
                                ? `عرض نتائج البحث عن "${query}"`
                                : `Showing results for "${query}"`}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {results.map((item) => (
                                <MovieCard
                                    key={item.id}
                                    item={item}
                                    mediaType={filter !== 'multi' ? filter : item.media_type}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-400 text-lg">{t('noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
