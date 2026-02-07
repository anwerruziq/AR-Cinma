import { useApp } from '../../context/AppContext';

const Loader = ({ fullScreen = false }) => {
    const { t } = useApp();

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                        {/* Outer ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-dark-100"></div>
                        {/* Spinning ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-cyan border-r-accent-cyan/30 animate-spin"></div>
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl text-accent-cyan">AR</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm animate-pulse">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-dark-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-cyan border-r-accent-cyan/30 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl text-accent-cyan font-bold">AR</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm animate-pulse">{t('loading')}</p>
            </div>
        </div>
    );
};

// Skeleton loader for cards
export const CardSkeleton = () => {
    return (
        <div className="rounded-xl overflow-hidden bg-dark-200 animate-pulse">
            <div className="aspect-[2/3] bg-dark-100"></div>
            <div className="p-3 space-y-2">
                <div className="h-4 bg-dark-100 rounded w-3/4"></div>
                <div className="h-3 bg-dark-100 rounded w-1/2"></div>
            </div>
        </div>
    );
};

// Skeleton loader for hero section
export const HeroSkeleton = () => {
    return (
        <div className="relative h-[70vh] md:h-[80vh] bg-dark-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                <div className="h-8 bg-dark-100 rounded w-1/3"></div>
                <div className="h-4 bg-dark-100 rounded w-2/3"></div>
                <div className="h-4 bg-dark-100 rounded w-1/2"></div>
                <div className="flex gap-4 mt-6">
                    <div className="h-12 bg-dark-100 rounded-full w-36"></div>
                    <div className="h-12 bg-dark-100 rounded-full w-36"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
