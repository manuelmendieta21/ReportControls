import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Dashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        // En una app real, aquí se limpiaría el token/sesión
        console.log("Cerrando sesión...");
        navigate("/");
    };

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
                <div className="p-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">analytics</span>
                            </div>
                            <h1 className="font-bold text-xl tracking-tight">MedSaaS</h1>
                        </div>
                        {/* Close Button Mobile */}
                        <button className="lg:hidden p-1 hover:bg-slate-800 rounded-lg" onClick={toggleMobileMenu}>
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <a className=" bg-primary text-white flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors " href="#">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} >dashboard</span>
                            <span className="font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400" href="#">
                            <span className="material-symbols-outlined" >analytics</span>
                            <span className="font-medium">Reportes</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400" href="#">
                            <span className="material-symbols-outlined">medical_services</span>
                            <span className="font-medium">Sedes</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400" href="#">
                            <span className="material-symbols-outlined">group</span>
                            <span className="font-medium">Pacientes</span>
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors mb-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>

                    <div className="flex items-center gap-3 px-4 py-3 pt-4 border-t border-slate-800/50">
                        <img alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDctl37jOIrnKadmegh7n9EprCsaGCNqaEZufeK75F-AoNokSuga4yJzWESWNPs1ePc6TWYhnP4sGwnnOen4UKaBzI-HIvB0GGJTjqXiNKBkxFxwHijYSxCXiMZR5Y22BrSdB06xIs6VSPG3SX1-_edBeclfLD65UAcOkzkCf4JzwUzti0nI4cyMveLH87kz57V2ZjsbuA4XiscF9az89kMPTFtBIhqxB_56qHOjRrLc0T7gS5PIioO7XPARZvorvCySSvo2_zYrA" />
                        <div className="overflow-hidden">
                            <p className="text-[12px] font-semibold truncate">Monica Montenegro</p>
                            <p className="text-[10px] text-slate-500 uppercase">Administrador</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button */}
                        <button
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            onClick={toggleMobileMenu}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">Análisis de Datos</h2>
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

                <main className="p-4 md:p-8 overflow-y-auto space-y-8">
                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <span className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
                                </span>
                                <span className="flex items-center text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    12%
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Visitas</p>
                            <p className="text-3xl font-bold mt-1">1,284</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <span className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">domain</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Conteo de Sedes</p>
                            <p className="text-3xl font-bold mt-1">12</p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
                            <div className="flex justify-between items-start mb-4">
                                <span className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600">
                                    <span className="material-symbols-outlined text-2xl">warning</span>
                                </span>
                            </div>
                            <p className="text-sm text-red-700/70 dark:text-red-400 font-medium">Riesgos Detectados</p>
                            <p className="text-3xl font-bold mt-1 text-red-700 dark:text-red-400">42</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <span className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                    <span className="material-symbols-outlined text-2xl">biotech</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pruebas Impl.</p>
                            <p className="text-3xl font-bold mt-1">315</p>
                        </div>
                    </section>

                    {/* Charts Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart Mockup */}
                        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Visitas por Sede</h3>
                                    <p className="text-sm text-slate-500">Volumen operativo últimos 30 días</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">Mes</button>
                                    <button className="px-3 py-1 text-xs bg-primary text-white rounded-lg">Semana</button>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-3 md:gap-6 px-2 md:px-4">
                                {[
                                    { label: "Norte", height: "65%", val: 124 },
                                    { label: "Sur", height: "85%", val: 182 },
                                    { label: "Este", height: "45%", val: 92 },
                                    { label: "Oeste", height: "95%", val: 210 },
                                    { label: "Central", height: "30%", val: 64 },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1 group h-full justify-end">
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative transition-all" style={{ height: item.height }}>
                                            <div className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-lg group-hover:bg-primary transition-all cursor-pointer h-full"></div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{item.val}</div>
                                        </div>
                                        <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase truncate w-full text-center">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pie Chart Mockup */}
                        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribución de Riesgos</h3>
                                <p className="text-sm text-slate-500">Clasificación por niveles de severidad crítica</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-around gap-8 md:gap-12 py-4">
                                <div className="relative w-40 md:w-48 h-40 md:h-48 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle className="stroke-slate-100 dark:stroke-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                        <circle className="stroke-red-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="25, 100" strokeDashoffset="0" strokeWidth="4"></circle>
                                        <circle className="stroke-amber-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="35, 100" strokeDashoffset="-25" strokeWidth="4"></circle>
                                        <circle className="stroke-emerald-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="40, 100" strokeDashoffset="-60" strokeWidth="4"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl md:text-3xl font-bold">42</span>
                                        <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Total</span>
                                    </div>
                                </div>
                                <div className="flex-1 w-full max-w-xs space-y-4 md:space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { label: "Alto Riesgo", color: "bg-red-500", cases: "11 casos", percent: "25%" },
                                            { label: "Moderado", color: "bg-amber-500", cases: "15 casos", percent: "35%" },
                                            { label: "Controlado", color: "bg-emerald-500", cases: "16 casos", percent: "40%" },
                                        ].map((risk, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-3 md:w-4 h-3 md:h-4 rounded-full ${risk.color}`}></span>
                                                    <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">{risk.label}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs md:text-sm font-bold block">{risk.cases}</span>
                                                    <span className="text-[10px] text-slate-400">{risk.percent}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Table Section */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Análisis Recientes</h3>
                            <button className="text-primary text-sm font-semibold hover:underline">Ver todo el historial</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Análisis</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sede</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fecha y Hora</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {[
                                        { title: "Auditoría Trimestral", sede: "Sede Norte", status: "Completado", date: "Hace 15 min", icon: "visibility", iconColor: "text-primary", bgColor: "bg-blue-100 dark:bg-blue-900/30", statusColor: "bg-emerald-100 text-emerald-700" },
                                        { title: "Alerta de Riesgo Operativo", sede: "Sede Sur", status: "En Revisión", date: "Hace 2 horas", icon: "warning", iconColor: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30", statusColor: "bg-amber-100 text-amber-700" },
                                        { title: "Pruebas Implementadas V2", sede: "Sede Este", status: "Completado", date: "Hace 5 horas", icon: "biotech", iconColor: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-900/30", statusColor: "bg-emerald-100 text-emerald-700" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg ${row.bgColor} flex items-center justify-center shrink-0`}>
                                                        <span className={`material-symbols-outlined ${row.iconColor}`}>{row.icon}</span>
                                                    </div>
                                                    <span className="font-semibold text-sm">{row.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{row.sede}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 ${row.statusColor} text-[10px] font-bold rounded-full uppercase truncate inline-block`}>{row.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{row.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">open_in_new</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
