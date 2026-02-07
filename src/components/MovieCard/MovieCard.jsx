import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiStar, BiPlay } from 'react-icons/bi';
import { useApp } from '../../context/AppContext';
import { getImageUrl, POSTER_SIZES } from '../../services/tmdbApi';

const MovieCard = ({ item, mediaType }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { language, isFavorite, toggleFavorite } = useApp();

    // Improve type detection: check prop, then item.media_type, then guess based on fields
    const type = mediaType || item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie');
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : '';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const posterUrl = getImageUrl(item.poster_path, POSTER_SIZES.medium);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item, type);
    };

    return (
        <Link
            to={`/${type}/${item.id}`}
            className="group relative block rounded-xl overflow-hidden bg-dark-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent-cyan/20"
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden">
                {/* Skeleton Loader */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-dark-100 animate-pulse" />
                )}

                {/* Poster */}
                {posterUrl && !imageError ? (
                    <img
                        src={posterUrl}
                        alt={title}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-100 to-dark-300">
                        <span className="text-6xl mb-2">🎬</span>
                        <span className="text-gray-500 text-xs text-center px-2">{title}</span>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button (on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-accent-cyan/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(255,75,31,0.5)]">
                        <BiPlay className="text-white ml-1" size={24} />
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-dark-400/90 backdrop-blur-sm rounded-lg">
                    <BiStar className="text-accent-cyan" size={14} />
                    <span className="text-white text-sm font-semibold">{rating}</span>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite(item.id, type)
                        ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.4)]'
                        : 'bg-dark-400/90 backdrop-blur-sm text-gray-300 hover:bg-accent-cyan hover:text-white hover:shadow-[0_0_15px_rgba(255,75,31,0.4)]'
                        }`}
                >
                    <BiHeart
                        size={18}
                        className={isFavorite(item.id, type) ? 'fill-current' : ''}
                    />
                </button>

                {/* Media Type Badge */}
                {type && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-accent-cyan/90 rounded text-xs font-semibold text-white uppercase shadow-lg">
                        {type === 'movie' ? (language === 'ar' ? 'فيلم' : 'Movie') : (language === 'ar' ? 'مسلسل' : 'Series')}
                    </div>
                )}
            </div>

            {/* Card Info */}
            <div className="p-3">
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-accent-cyan transition-colors duration-300">
                    {title}
                </h3>
                {year && (
                    <p className="text-gray-500 text-xs mt-1">{year}</p>
                )}
            </div>
        </Link>
    );
};

export default MovieCard;
