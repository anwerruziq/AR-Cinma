import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchDetails, fetchSeasonDetails, getImageUrl, BACKDROP_SIZES, POSTER_SIZES } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard/MovieCard';
import Loader from '../components/Loader/Loader';
import { BiPlay, BiHeart, BiStar, BiTime, BiCalendar, BiX, BiChevronDown, BiDownload, BiDesktop } from 'react-icons/bi';

const Details = () => {
    const { type, id } = useParams();
    const { t, getApiLanguage, language, isFavorite, toggleFavorite } = useApp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    // TV Series specific states
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedEpisodeData, setSelectedEpisodeData] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(0);
    const [activeProvider, setActiveProvider] = useState('vidsrc-to');

    const BATCH_SIZE = 24;
    const PROVIDERS = [
        { id: 'vidsrc-to', name: 'Server 1', url: 'https://vidsrc.to/embed' },
        { id: 'vidsrc-me', name: 'Server 2', url: 'https://vidsrc.me/embed' },
        { id: 'multiembed', name: 'Server 3', url: 'https://multiembed.mov/directstream.php?video_id=' }
    ];

    const getPlayerUrl = (providerId, mediaType, id, season, episode) => {
        const provider = PROVIDERS.find(p => p.id === providerId);
        if (providerId === 'multiembed') {
            return `${provider.url}${id}${mediaType === 'tv' ? `&s=${season}&e=${episode}` : ''}`;
        }
        return `${provider.url}/${mediaType}/${id}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`;
    };

    const mediaType = type === 'tv' ? 'tv' : 'movie';

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            try {
                const result = await fetchDetails(mediaType, id, getApiLanguage());
                setData(result);
                setSelectedSeason(result.seasons?.some(s => s.season_number === 1) ? 1 : (result.seasons?.[0]?.season_number || 0));
                setIsEpisodesExpanded(false);
                setSelectedBatch(0);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
        window.scrollTo(0, 0);
    }, [mediaType, id, getApiLanguage]);

    useEffect(() => {
        if (mediaType === 'tv' && id) {
            const loadEpisodes = async () => {
                setLoadingEpisodes(true);
                try {
                    const result = await fetchSeasonDetails(id, selectedSeason, getApiLanguage());
                    setEpisodes(result.episodes || []);
                    setSelectedBatch(0);
                } catch (error) {
                    console.error('Error fetching episodes:', error);
                } finally {
                    setLoadingEpisodes(false);
                }
            };
            loadEpisodes();
        }
    }, [id, selectedSeason, mediaType, getApiLanguage]);

    if (loading) return <Loader fullScreen />;
    if (!data) return <div className="min-h-screen bg-primary flex items-center justify-center"><p className="text-gray-400">{t('error')}</p></div>;

    const title = data.title || data.name;
    const year = (data.release_date || data.first_air_date)?.split('-')[0];
    const runtime = data.runtime || (data.episode_run_time?.[0]);
    const backdrop = getImageUrl(data.backdrop_path, BACKDROP_SIZES.original);
    const poster = getImageUrl(data.poster_path, POSTER_SIZES.large);
    const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const cast = data.credits?.cast?.slice(0, 12) || [];
    const similar = data.similar?.results?.slice(0, 8) || data.recommendations?.results?.slice(0, 8) || [];

    return (
        <div className="min-h-screen bg-primary">
            <div className="relative h-[50vh] md:h-[70vh]">
                {backdrop ? <img src={backdrop} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-dark-200" />}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-r ${language === 'ar' ? 'from-transparent via-transparent to-primary/90' : 'from-primary/90 via-transparent to-transparent'}`} />
            </div>

            <div className="relative -mt-72 md:-mt-96 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                                {poster ? <img src={poster} alt={title} className="w-full" /> : <div className="w-full aspect-[2/3] bg-dark-200 flex items-center justify-center"><span className="text-6xl">🎬</span></div>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h1>
                            {data.tagline && <p className="text-accent-cyan text-lg italic mb-4">"{data.tagline}"</p>}

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                                <span className="flex items-center gap-1 bg-dark-200 px-3 py-1 rounded-full"><BiStar className="text-accent-cyan" /><span className="font-semibold">{data.vote_average?.toFixed(1)}</span></span>
                                {year && <span className="flex items-center gap-1"><BiCalendar size={16} /><span>{year}</span></span>}
                                {runtime && <span className="flex items-center gap-1"><BiTime size={16} /><span>{runtime} {t('minutes')}</span></span>}
                                {mediaType === 'tv' && data.number_of_seasons && <span className="text-sm">{data.number_of_seasons} {t('seasons')} • {data.number_of_episodes} {t('episodes')}</span>}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {data.genres?.map(genre => <span key={genre.id} className="px-3 py-1 bg-dark-100 border border-dark-100 rounded-full text-sm text-gray-300">{genre.name}</span>)}
                            </div>

                            <div className="flex flex-wrap gap-4 mb-8">
                                {trailer && <button onClick={() => setShowTrailer(true)} className="flex items-center gap-2 px-6 py-3 bg-accent-cyan hover:bg-accent-cyan/80 text-white font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(255,75,31,0.3)] hover:shadow-[0_0_20px_rgba(255,75,31,0.5)]"><BiPlay /><span>{t('trailer')}</span></button>}
                                {mediaType === 'tv' && data.seasons && (
                                    <div className="flex gap-4">
                                        <button onClick={() => { if (episodes.length > 0) { setSelectedEpisodeData(episodes[0]); setShowPlayer(true); } else setIsEpisodesExpanded(true); }} className="flex items-center gap-2 px-6 py-3 bg-accent-cyan hover:bg-accent-cyan/80 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(255,75,31,0.3)] hover:shadow-[0_0_20px_rgba(255,75,31,0.5)]"><BiPlay /><span>{t('watchNow')}</span></button>
                                        <button onClick={() => setIsEpisodesExpanded(true)} className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all border border-white/5"><BiDesktop className="text-accent-cyan" /><span>{t('episodes')}</span></button>
                                    </div>
                                )}
                                {mediaType === 'movie' && <button onClick={() => { setSelectedEpisodeData(null); setShowPlayer(true); }} className="flex items-center gap-2 px-6 py-3 bg-accent-cyan text-white hover:bg-accent-cyan/80 font-bold rounded-full transition-all shadow-[0_0_15px_rgba(255,75,31,0.3)] hover:shadow-[0_0_20px_rgba(255,75,31,0.5)]"><BiDesktop /><span>{language === 'ar' ? 'مشاهدة الآن' : 'Watch Now'}</span></button>}
                                <button onClick={() => toggleFavorite(data, mediaType)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${isFavorite(data.id, mediaType) ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(255,75,31,0.3)]' : 'bg-dark-200 text-gray-300 hover:bg-dark-100'}`}><BiHeart className={isFavorite(data.id, mediaType) ? 'fill-current' : ''} /><span>{t('favorites')}</span></button>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-white mb-3">{t('overview')}</h2>
                                <p className="text-gray-300 leading-relaxed">{data.overview || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No overview available')}</p>
                            </div>
                        </div>
                    </div>

                    {cast.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">{t('cast')}</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {cast.map(person => (
                                    <div key={person.id} className="flex-shrink-0 w-28 text-center">
                                        <div className="w-28 h-28 rounded-full overflow-hidden bg-dark-200 mb-2">{person.profile_path ? <img src={getImageUrl(person.profile_path, 'w185')} alt={person.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>}</div>
                                        <p className="text-white text-sm font-medium truncate">{person.name}</p>
                                        <p className="text-gray-500 text-xs truncate">{person.character}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {similar.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">{t('similar')}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">{similar.map(item => <MovieCard key={item.id} item={item} />)}</div>
                        </section>
                    )}
                </div>
            </div>

            {showTrailer && trailer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
                    <button onClick={() => setShowTrailer(false)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-accent-cyan transition-all z-20 hover:scale-110 active:scale-95"><BiX size={24} /></button>
                    <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} title="Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" /></div>
                </div>
            )}

            {isEpisodesExpanded && mediaType === 'tv' && (
                <div className="fixed inset-0 z-[100] bg-dark-200 flex flex-col items-center justify-start transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
                    <div className="w-full bg-primary/90 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-20 shadow-2xl">
                        <div className="container mx-auto px-4 py-4 md:py-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <h3 className="text-accent-cyan text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-80">{title}</h3>
                                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">{t('episodes')} <span className="text-white/20 font-light">/</span> <span className="text-lg md:text-xl font-medium text-gray-400">{episodes.length} {t('episodes')}</span></h2>
                                </div>
                                <button onClick={() => setIsEpisodesExpanded(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-accent-cyan transition-all hover:scale-110 active:scale-95 border border-white/5 shadow-xl"><BiX size={24} /></button>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-edges border-b border-white/5">
                                {data.seasons?.sort((a, b) => a.season_number - b.season_number).map(season => (
                                    <button key={season.id} onClick={() => setSelectedSeason(season.season_number)} className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${selectedSeason === season.season_number ? 'bg-accent-cyan text-white border-accent-cyan shadow-[0_0_15px_rgba(255,75,31,0.4)] scale-105' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}>
                                        {season.season_number === 0 ? (language === 'ar' ? 'حلقات خاصة' : 'Specials') : (language === 'ar' ? `الموسم ${season.season_number}` : `Season ${season.season_number}`)}
                                    </button>
                                ))}
                            </div>
                            {episodes.length > BATCH_SIZE && (
                                <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{language === 'ar' ? 'المجموعة:' : 'BATCH:'}</span>
                                    {Array.from({ length: Math.ceil(episodes.length / BATCH_SIZE) }).map((_, idx) => {
                                        const start = idx * BATCH_SIZE + 1;
                                        const end = Math.min((idx + 1) * BATCH_SIZE, episodes.length);
                                        return <button key={idx} onClick={() => setSelectedBatch(idx)} className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedBatch === idx ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10'}`}>{start}-{end}</button>;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex-1 overflow-y-auto custom-scrollbar bg-primary/40">
                        <div className="container mx-auto px-4 py-8 md:py-12">
                            {loadingEpisodes ? (
                                <div className="flex flex-col items-center justify-center py-32 gap-6"><div className="relative"><div className="w-16 h-16 border-4 border-white/5 rounded-full"></div><div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div></div><p className="text-gray-400 font-bold tracking-widest animate-pulse">{t('loading')}...</p></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {episodes.slice(selectedBatch * BATCH_SIZE, (selectedBatch + 1) * BATCH_SIZE).map(episode => (
                                        <div key={episode.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-accent-cyan/40 transition-all group flex flex-col transform hover:-translate-y-2 duration-500 shadow-xl shadow-black/20 hover:shadow-accent-cyan/5">
                                            <div className="relative aspect-video">
                                                {episode.still_path ? <img src={getImageUrl(episode.still_path, 'w500')} alt={episode.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <div className="w-full h-full bg-dark-100 flex items-center justify-center"><span className="text-5xl opacity-20 filter grayscale">🎬</span></div>}
                                                <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 transform md:translate-y-4 group-hover:translate-y-0">
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedEpisodeData(episode); setShowPlayer(true); }} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent-cyan text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,75,31,0.5)] active:scale-95"><BiPlay size={24} /></button>
                                                    <a href={getPlayerUrl(activeProvider, mediaType, id, selectedSeason, episode.episode_number)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-accent-cyan transition-all hover:scale-110 shadow-lg border border-white/10 active:scale-95"><BiDownload size={22} /></a>
                                                </div>
                                            </div>
                                            <div className="absolute top-4 start-4 px-3 py-1 bg-accent-cyan text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(255,75,31,0.3)] z-10">{language === 'ar' ? `حلقة ${episode.episode_number}` : `EP ${episode.episode_number}`}</div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-white font-bold mb-2 line-clamp-1 group-hover:text-accent-cyan transition-colors text-lg">{episode.name}</h3>
                                                <p className="text-gray-400 text-xs mb-6 line-clamp-3 leading-relaxed flex-1 opacity-70 group-hover:opacity-100 transition-opacity">{episode.overview || (language === 'ar' ? 'لا يوجد وصف متاح لهذه الحلقة.' : 'No description available for this episode.')}</p>
                                                <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold pt-4 border-t border-white/5">
                                                    <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded"><BiCalendar size={12} className="text-accent-cyan" />{episode.air_date ? new Date(episode.air_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short' }) : '—'}</span>
                                                    {episode.runtime && <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded"><BiTime size={12} className="text-accent-cyan" />{episode.runtime} {t('minutes')}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!loadingEpisodes && episodes.length === 0 && <div className="flex flex-col items-center justify-center py-32"><span className="text-6xl mb-4 grayscale opacity-20">📭</span><p className="text-gray-400 text-lg font-medium">{t('noResults')}</p></div>}
                        </div>
                    </div>
                </div>
            )}

            {showPlayer && (
                <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-500">
                    <div className="w-full bg-gradient-to-b from-black/60 to-transparent p-6 flex items-center justify-between absolute top-0 left-0 z-10 hover:opacity-100 opacity-0 transition-opacity duration-300 group">
                        <div className="flex flex-col">
                            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">{title}</h3>
                            <div className="flex items-center gap-3">
                                <h2 className="text-white text-lg md:text-xl font-black">{selectedEpisodeData ? (language === 'ar' ? `م${selectedSeason} ح${selectedEpisodeData.episode_number}` : `S${selectedSeason} E${selectedEpisodeData.episode_number}`) : (language === 'ar' ? 'مشاهدة الفيلم' : 'Watching Movie')}</h2>
                                <div className="h-4 w-px bg-white/10 hidden md:block" />
                                <div className="hidden md:flex items-center gap-2">
                                    {PROVIDERS.map(p => (
                                        <button key={p.id} onClick={() => setActiveProvider(p.id)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all border ${activeProvider === p.id ? 'bg-accent-cyan text-white border-accent-cyan shadow-[0_0_15px_rgba(255,75,31,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10'}`}>{p.name}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => { const url = getPlayerUrl(activeProvider, mediaType, id, selectedSeason, selectedEpisodeData?.episode_number); window.open(url, '_blank'); }} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all text-xs font-black border border-white/5 active:scale-95 shadow-xl"><BiDownload className="text-accent-cyan" /> {language === 'ar' ? 'تحميل' : 'DOWNLOAD'}</button>
                            <button onClick={() => setShowPlayer(false)} className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-accent-cyan transition-all hover:scale-110 border border-white/10 backdrop-blur-md shadow-2xl"><BiX size={24} /></button>
                        </div>
                    </div>
                    <button onClick={() => setShowPlayer(false)} className="md:hidden absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/10 backdrop-blur-sm"><BiX size={20} /></button>
                    <div className="flex-1 w-full bg-black relative">
                        <iframe src={getPlayerUrl(activeProvider, mediaType, id, selectedSeason, selectedEpisodeData?.episode_number)} className="w-full h-full border-none" allowFullScreen title="Cinema Player" />
                        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-primary/20"><div className="relative"><div className="w-16 h-16 border-4 border-white/5 rounded-full"></div><div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin absolute top-0"></div></div></div>
                    </div>
                    <div className="w-full p-4 bg-primary/80 backdrop-blur-xl border-t border-white/5 text-center px-6">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-wider">{language === 'ar' ? '💡 تنبيه: إذا لم يظهر المحتوى، جرب تبديل "السيرفر" من قائمة الخيارات داخل المشغل. ينصح باستخدام متصفح يدعم حجب الإعلانات.' : '💡 TIP: If content doesn\'t load, try switching the "Server" from the player menu. Using an ad-blocking browser is highly recommended.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Details;
