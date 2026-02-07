import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchDiscover, fetchGenres } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard/MovieCard';
import Pagination from '../components/Pagination/Pagination';
import { CardSkeleton } from '../components/Loader/Loader';
import { BiFilter, BiX } from 'react-icons/bi';

const Movies = () => {
    const { t, getApiLanguage, language } = useApp();
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    const sortOptions = [
        { value: 'popularity.desc', label: language === 'ar' ? 'الأكثر شعبية' : 'Most Popular' },
        { value: 'vote_average.desc', label: language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated' },
        { value: 'release_date.desc', label: language === 'ar' ? 'الأحدث' : 'Newest' },
        { value: 'release_date.asc', label: language === 'ar' ? 'الأقدم' : 'Oldest' },
    ];

    // Fetch genres
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenres('movie', getApiLanguage());
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        loadGenres();
    }, [getApiLanguage]);

    // Fetch movies
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchDiscover('movie', {
                    language: getApiLanguage(),
                    page,
                    genres: selectedGenre,
                    year: selectedYear,
                    sortBy,
                });
                setMovies(data.results || []);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [getApiLanguage, page, selectedGenre, selectedYear, sortBy, language]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSelectedGenre('');
        setSelectedYear('');
        setSortBy('popularity.desc');
        setPage(1);
    };

    const hasActiveFilters = selectedGenre || selectedYear || sortBy !== 'popularity.desc';

    return (
        <div className="min-h-screen bg-primary pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className={`flex items-center justify-between mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {t('movies')}
                    </h1>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showFilters || hasActiveFilters
                            ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.3)]'
                            : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
                            }`}
                    >
                        <BiFilter size={18} />
                        <span className="hidden sm:inline">{t('genre')}</span>
                    </button>
                </div>

                {/* Filters Panel */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="bg-dark-200 rounded-2xl p-6 border border-dark-100">
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${language === 'ar' ? 'text-right' : ''}`}>
                            {/* Genre Filter */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t('genre')}</label>
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:border-accent-cyan/50"
                                >
                                    <option value="">{t('allGenres')}</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.id}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t('year')}</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:border-accent-cyan/50"
                                >
                                    <option value="">{t('allYears')}</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    {language === 'ar' ? 'ترتيب حسب' : 'Sort By'}
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                    className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:border-accent-cyan/50"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-dark-400 text-gray-300 rounded-lg hover:bg-accent-cyan hover:text-white transition-all shadow-[0_0_15px_rgba(255,75,31,0.2)] hover:shadow-[0_0_20px_rgba(255,75,31,0.4)]"
                            >
                                <BiX size={16} />
                                <span>{language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Movies Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} item={movie} mediaType="movie" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">{t('noResults')}</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && movies.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Movies;
