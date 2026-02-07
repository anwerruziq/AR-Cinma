import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BiPlay, BiInfoCircle, BiChevronLeft, BiChevronRight, BiStar } from 'react-icons/bi';
import { useApp } from '../../context/AppContext';
import { getImageUrl, BACKDROP_SIZES } from '../../services/tmdbApi';
import { HeroSkeleton } from '../Loader/Loader';

const Slider = ({ items = [], loading = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { t, language } = useApp();

    const nextSlide = useCallback(() => {
        if (isAnimating || items.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, items.length]);

    const prevSlide = useCallback(() => {
        if (isAnimating || items.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, items.length]);

    // Auto-play
    useEffect(() => {
        if (items.length === 0) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [nextSlide, items.length]);

    if (loading) {
        return <HeroSkeleton />;
    }

    if (!items || items.length === 0) {
        return null;
    }

    const currentItem = items[currentIndex];
    const title = currentItem.title || currentItem.name;
    const mediaType = currentItem.media_type || (currentItem.first_air_date ? 'tv' : 'movie');
    const backdropUrl = getImageUrl(currentItem.backdrop_path, BACKDROP_SIZES.original);

    return (
        <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
            {/* Background Images */}
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-700 ${index === currentIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                        }`}
                >
                    {getImageUrl(item.backdrop_path, BACKDROP_SIZES.original) ? (
                        <img
                            src={getImageUrl(item.backdrop_path, BACKDROP_SIZES.original)}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-dark-200" />
                    )}
                </div>
            ))}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-e from-primary/90 to-transparent`} />

            {/* Content */}
            <div className="absolute inset-0 flex items-end pb-20 md:items-center md:pb-0">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                        {/* Media Type Badge */}
                        <span className="inline-block px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan text-xs font-semibold uppercase mb-4 animate-fade-in">
                            {mediaType === 'movie' ? t('movies') : t('tvShows')}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-slide-up">
                            {title}
                        </h1>

                        {/* Rating & Year */}
                        <div className="flex items-center gap-4 mb-4">
                            <span className="flex items-center gap-1 text-accent-cyan">
                                <BiStar size={18} />
                                <span className="font-semibold">{currentItem.vote_average?.toFixed(1)}</span>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300">
                                {new Date(currentItem.release_date || currentItem.first_air_date).getFullYear()}
                            </span>
                        </div>

                        {/* Overview */}
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 animate-fade-in">
                            {currentItem.overview || t('noOverview')}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Link
                                to={`/${mediaType}/${currentItem.id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-accent-cyan hover:bg-accent-cyan/80 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,75,31,0.4)] hover:shadow-[0_0_30px_rgba(255,75,31,0.6)]"
                            >
                                <BiPlay size={20} className="rtl:rotate-180" />
                                <span>{t('watchNow')}</span>
                            </Link>
                            <Link
                                to={`/${mediaType}/${currentItem.id}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full transition-all duration-300"
                            >
                                <BiInfoCircle size={20} />
                                <span>{t('moreInfo')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows - Using logical positioning */}
            <button
                onClick={prevSlide}
                className="absolute start-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 hover:opacity-100 md:opacity-70"
            >
                <BiChevronLeft size={24} className="rtl:rotate-180" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute end-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 hover:opacity-100 md:opacity-70"
            >
                <BiChevronRight size={24} className="rtl:rotate-180" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 dir-ltr">
                {items.slice(0, 8).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsAnimating(false), 500);
                            }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'w-8 bg-accent-cyan shadow-[0_0_10px_rgba(0,242,254,0.5)]'
                            : 'bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
