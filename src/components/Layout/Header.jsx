import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { LogOut, Menu } from 'lucide-react';

const Header = ({ onToggleMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="h-16 shrink-0 px-4 md:px-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onToggleMenu}
                    aria-label="Open menu"
                    className="lg:hidden shrink-0 p-2.5 -ml-2 rounded-xl text-dim hover:text-bright hover:bg-raised transition-colors touch-manipulation active:scale-[0.95]"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2 lg:hidden">
                    <img src="/sina-people.svg" alt="SINA People" className="w-8 h-8 rounded-lg shrink-0" />
                </div>
                <h2 className="text-[15px] font-medium text-dim truncate">
                    {getGreeting()}, <span className="font-semibold text-bright">{user?.name}</span>
                </h2>
            </div>
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <ThemeToggle />

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-3 md:py-1.5 rounded-xl md:rounded-md border border-border text-sm font-semibold hover:bg-raised transition-all active:scale-95 text-dim hover:text-foreground touch-manipulation"
                    id="logout-btn"
                    aria-label="Logout"
                >
                    <LogOut size={15} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export default Header;