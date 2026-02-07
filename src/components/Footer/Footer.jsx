import { useApp } from '../../context/AppContext';
import { BiWorld, BiLogoGithub, BiLogoInstagram, BiCodeAlt } from 'react-icons/bi';

const Footer = () => {
    const { t, language } = useApp();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Portfolio',
            image: '/images/1770382658096.png',
            url: 'https://anwer-web.vercel.app',
            color: 'hover:text-accent-cyan'
        },
        {
            name: 'GitHub',
            icon: BiLogoGithub,
            url: 'https://github.com/anwerruziq',
            color: 'hover:text-white'
        },
        {
            name: 'Instagram',
            icon: BiLogoInstagram,
            url: 'https://www.instagram.com/a_r.coder?igsh=MTFuMzhwdHRsb2t4dA==',
            color: 'hover:text-pink-500'
        }
    ];

    return (
        <footer className="bg-primary border-t border-white/5 pt-6 pb-4 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-1">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="AR Coder Logo" className="w-10 h-10 object-contain rounded-lg shadow-[0_0_10px_rgba(0,242,254,0.2)]" />
                            <span className="text-xl font-bold text-white tracking-wider">Coder</span>
                        </div>
                        <p className="text-gray-500 text-[10px] max-w-xs text-center md:text-start leading-relaxed opacity-60">
                            {language === 'ar'
                                ? 'تطوير وبرمجة {AR} Coder.'
                                : 'Developed by {AR} Coder.'}
                        </p>
                    </div>

                    {/* Social Links Section */}
                    <div className="flex flex-col items-center gap-2">
                        <h4 className="text-white/50 font-bold text-[10px] uppercase tracking-[0.2em]">
                            {language === 'ar' ? 'تواصل معي' : 'Connect With Me'}
                        </h4>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-xl bg-dark-200 border border-white/5 flex items-center justify-center text-gray-400 ${link.color} transition-all duration-300 hover:scale-110 hover:border-accent-cyan/30 shadow-xl hover:shadow-[0_0_20px_rgba(255,75,31,0.2)] group overflow-hidden`}
                                    aria-label={link.name}
                                >
                                    {link.image ? (
                                        <img src={link.image} alt={link.name} className="w-6 h-6 object-contain group-hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
                                    ) : (
                                        <link.icon size={22} className="group-hover:drop-shadow-[0_0_8px_currentColor]" />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Badge Section */}
                    <div className="hidden lg:flex flex-col items-end gap-2">
                        <div className="px-4 py-2 bg-accent-cyan/5 border border-accent-cyan/10 rounded-full flex items-center gap-2">
                            <BiCodeAlt className="text-accent-cyan" />
                            <span className="text-xs font-bold text-accent-cyan tracking-widest uppercase">Developer Choice</span>
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium">Built with React & TMDB API</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-[11px] font-bold tracking-widest uppercase">
                        © {currentYear} {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'} • {"{AR}"} Coder
                    </p>
                    <div className="flex items-center gap-6">
                        <button className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-widest">
                            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </button>
                        <button className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-widest">
                            {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
