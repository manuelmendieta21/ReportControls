export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 transition-colors">
            <div className="container mx-auto px-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">biotech</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Data Lab<span className="text-primary">.</span>
                        </span>
                    </div>

                    {/* Links */}
                    <nav className="flex gap-8">
                        <a href="#about" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Nosotros</a>
                        <a href="#contact" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Contacto</a>
                        <a href="/login" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Acceso</a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-slate-400 font-medium">
                        &copy; {new Date().getFullYear()} Report Controls. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
