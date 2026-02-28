import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";

export function Dashboard() {
    const [stats, setStats] = useState({
        total_visits: 0,
        sedes_count: 0,
        risks_detected: 0,
        risks_distribution: { alto: 0, moderado: 0, bajo: 0 },
        recent_reports: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/stats");
                if (!response.ok) throw new Error("Error al cargar estadísticas");
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return (
        <DashboardLayout title="Cargando...">
            <div className="flex items-center justify-center h-64">
                <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout title="Panel de Control">
            <div className="space-y-8">
                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <span className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Visitas</p>
                        <p className="text-3xl font-bold mt-1">{stats.total_visits}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <span className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">domain</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Conteo de Sedes</p>
                        <p className="text-3xl font-bold mt-1">{stats.sedes_count}</p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <span className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600">
                                <span className="material-symbols-outlined text-2xl">warning</span>
                            </span>
                        </div>
                        <p className="text-sm text-red-700/70 dark:text-red-400 font-medium">Riesgos Detectados</p>
                        <p className="text-3xl font-bold mt-1 text-red-700 dark:text-red-400">{stats.risks_detected}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <span className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                <span className="material-symbols-outlined text-2xl">biotech</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Reportes Guardados</p>
                        <p className="text-3xl font-bold mt-1">{stats.total_visits}</p>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart Mockup (Still using distribution for now or stays mockup) */}
                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Visitas por Sede</h3>
                                <p className="text-sm text-slate-500">Volumen operativo por sede</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-3 md:gap-6 px-2 md:px-4">
                            {/* Real data for this would require another aggregation, keep as representation for now */}
                            {[
                                { label: "Norte", height: "65%", val: 65 },
                                { label: "Sur", height: "85%", val: 85 },
                                { label: "Este", height: "45%", val: 45 },
                                { label: "Oeste", height: "95%", val: 95 },
                                { label: "Central", height: "30%", val: 30 },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 flex-1 group h-full justify-end">
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative transition-all" style={{ height: item.height }}>
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-lg group-hover:bg-primary transition-all cursor-pointer h-full"></div>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-slate-500 font-medium uppercase truncate w-full text-center">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pie Chart Real Data */}
                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="mb-8">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribución de Riesgos</h3>
                            <p className="text-sm text-slate-500">Clasificación real por niveles</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-around gap-8 md:gap-12 py-4">
                            <div className="relative w-40 md:w-48 h-40 md:h-48 shrink-0">
                                {(() => {
                                    const total = stats.total_visits || 1;
                                    const highPerc = (stats.risks_distribution.alto / total) * 100;
                                    const modPerc = (stats.risks_distribution.moderado / total) * 100;
                                    const lowPerc = (stats.risks_distribution.bajo / total) * 100;
                                    return (
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <circle className="stroke-slate-100 dark:stroke-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                            <circle className="stroke-red-500" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${highPerc}, 100`} strokeDashoffset="0" strokeWidth="4"></circle>
                                            <circle className="stroke-amber-500" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${modPerc}, 100`} strokeDashoffset={`-${highPerc}`} strokeWidth="4"></circle>
                                            <circle className="stroke-emerald-500" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${lowPerc}, 100`} strokeDashoffset={`-${highPerc + modPerc}`} strokeWidth="4"></circle>
                                        </svg>
                                    );
                                })()}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl md:text-3xl font-bold">{stats.total_visits}</span>
                                    <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Total</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full max-w-xs space-y-4 md:space-y-6">
                                <div className="space-y-4">
                                    {[
                                        { label: "Alto Riesgo", color: "bg-red-500", count: stats.risks_distribution.alto },
                                        { label: "Moderado", color: "bg-amber-500", count: stats.risks_distribution.moderado },
                                        { label: "Bajo Riesgo", color: "bg-emerald-500", count: stats.risks_distribution.bajo },
                                    ].map((risk, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 md:w-4 h-3 md:h-4 rounded-full ${risk.color}`}></span>
                                                <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">{risk.label}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs md:text-sm font-bold block">{risk.count} casos</span>
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
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Archivo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sede</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Calificación</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {stats.recent_reports.length > 0 ? stats.recent_reports.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0`}>
                                                    <span className={`material-symbols-outlined text-primary`}>visibility</span>
                                                </div>
                                                <span className="font-semibold text-sm truncate max-w-[150px]">{row.archivo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{row.sede}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 ${row.clasificacion_riesgo.toLowerCase().includes('bajo') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} text-[10px] font-bold rounded-full uppercase truncate inline-block`}>
                                                {row.clasificacion_riesgo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{row.calificacion_obtenida}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">open_in_new</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No hay reportes procesados aún.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
