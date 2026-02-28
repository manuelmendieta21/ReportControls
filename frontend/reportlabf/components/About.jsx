export function About() {
    return (
        <section id="about" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative z-10 bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img
                                src="/img/linechart.png"
                                alt="Dashboard Intelligence"
                                className="w-full h-auto rounded-xl shadow-lg ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                    <span className="text-3xl font-bold text-primary">100%</span>
                                    <p className="text-xs text-slate-500 uppercase font-bold mt-1">Precisión</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                    <span className="text-3xl font-bold text-indigo-500">24/7</span>
                                    <p className="text-xs text-slate-500 uppercase font-bold mt-1">Disponibilidad</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                                Potenciando tu Control
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Transformación de Datos en <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600">Decisiones Reales</span>
                            </h2>
                        </div>

                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Nuestra plataforma simplifica el procesamiento de informes complejos, permitiendo que tu equipo se enfoque en lo que realmente importa: **la mejora continua y la gestión eficiente de riesgos.**
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: "analytics",
                                    title: "Procesamiento Inteligente",
                                    desc: "Extracción automática de datos desde archivos Excel y CSV con alta precisión."
                                },
                                {
                                    icon: "dashboard",
                                    title: "Dashboard Dinámico",
                                    desc: "Visualización en tiempo real de estadísticas, riesgos y desempeño por sede."
                                },
                                {
                                    icon: "security",
                                    title: "Seguridad Garantizada",
                                    desc: "Control absoluto de duplicados y persistencia segura de la información."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{feature.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
