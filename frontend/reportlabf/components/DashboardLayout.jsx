import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sesion } from "./Sesion";
import { DataLabLogo } from "./DataLabLogo";


export function DashboardLayout({ children, title = "Análisis de Datos" }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive(path)
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"}
    `;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex relative">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
                lg:translate-x-0 lg:static lg:inset-auto
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg">
                            <DataLabLogo className="w-45 dark:bg-white" />
                        </div>
                        {/* Close Button Mobile */}
                        <button className="lg:hidden p-1 hover:bg-slate-800 rounded-lg" onClick={toggleMobileMenu}>
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <Link className={navLinkClass("/dashboard")} to="/dashboard">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link className={navLinkClass("/reports")} to="/reports">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium">Reportes</span>
                        </Link>
                        <Link className={navLinkClass("/sedes")} to="#">
                            <span className="material-symbols-outlined">medical_services</span>
                            <span className="font-medium">Sedes</span>
                        </Link>
                        <Link className={navLinkClass("/pacientes")} to="#">
                            <span className="material-symbols-outlined">group</span>
                            <span className="font-medium">Pacientes</span>
                        </Link>
                    </nav>
                </div>

                <Sesion />
            </aside >

            {/* Main Content */}
            < div className="flex-1 flex flex-col min-w-0" >
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button */}
                        <button
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            onClick={toggleMobileMenu}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">{title}</h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="relative hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-48 lg:w-64 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Buscar reportes..." type="text" />
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>
                    </div>
                </header>

                <main className="p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div >
        </div >
    );
}
