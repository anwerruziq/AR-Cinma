import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BiMenu, BiX, BiSearch, BiHeart, BiGlobe } from 'react-icons/bi';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { language, toggleLanguage, t } = useApp();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsOpen(false);
        }
    };

    const navLinks = [
        { path: '/', label: t('home') },
        { path: '/movies', label: t('movies') },
        { path: '/tv-shows', label: t('tvShows') },
        { path: '/anime', label: t('anime') },
        { path: '/favorites', label: t('favorites') },
    ];

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-primary via-primary/95 to-transparent backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo - Automatically positions based on dir */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/images/logo.png"
                            alt="AR Coder Logo"
                            className="w-10 h-10 object-contain transform group-hover:scale-110 transition-transform duration-300 rounded-lg shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                        />
                        <span className="text-white font-bold text-xl hidden sm:block">
                            {t('cinema')}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-all duration-300 hover:text-accent-cyan ${isActive ? 'text-accent-cyan' : 'text-gray-300'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('search')}
                                    className="w-48 lg:w-64 ps-4 pe-10 py-2 bg-dark-200/80 border border-dark-100 rounded-full text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent-gold/50 transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent-cyan transition-colors"
                                >
                                    <BiSearch size={18} />
                                </button>
                            </div>
                        </form>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-3 py-1.5 bg-dark-200/80 border border-dark-100 rounded-full text-sm text-gray-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300"
                        >
                            <BiGlobe size={16} />
                            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
                        </button>

                        {/* Favorites Link (Mobile) */}
                        <Link
                            to="/favorites"
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-dark-200/80 text-gray-300 hover:text-accent-cyan transition-colors"
                        >
                            <BiHeart size={20} />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-dark-200/80 text-gray-300 hover:text-white transition-colors"
                        >
                            {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="py-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="px-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('search')}
                                    className="w-full ps-4 pe-12 py-3 bg-dark-200 border border-dark-100 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent-cyan transition-colors"
                                >
                                    <BiSearch size={20} />
                                </button>
                            </div>
                        </form>

                        {/* Mobile Nav Links */}
                        <div className="flex flex-col gap-2 px-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                                            ? 'bg-accent-cyan/20 text-accent-cyan'
                                            : 'text-gray-300 hover:bg-dark-200'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
