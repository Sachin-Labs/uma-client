import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        setSidebarOpen(false);
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0 });
        }
    }, [location.pathname]);

    return (
        <div className="flex h-dvh bg-background transition-colors duration-300 overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 ml-0 lg:ml-64 min-w-0 min-h-0 flex flex-col">
                <Header onToggleMenu={() => setSidebarOpen(true)} />
                <main
                    ref={mainRef}
                    className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-[max(1rem,env(safe-area-inset-bottom))]"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;