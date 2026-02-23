import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import users from "../src/data/users.json";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Basic mock authentication logic
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            console.log("Login successful for:", user.name);
            // In a real app, we would set a token or session here
            navigate("/dashboard");
        } else {
            setError("Credenciales incorrectas. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[80vh] flex items-center justify-center p-4">
            {/* Main Container */}
            <main className="w-full max-w-[400px] flex flex-col items-center">
                {/* Header Branding */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
                        <span className="material-icons text-white text-2xl">analytics</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Inicio de Sesión</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Portal de Reportes</p>
                </div>

                {/* Login Card */}
                <div className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-8">
                    <header className="mb-6">
                        <h2 className="text-xl font-semibold">Bienvenido</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Inicia sesión para acceder a tu portal</p>
                    </header>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1" htmlFor="email">
                                Correo Electronico
                            </label>
                            <div className="relative group">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                                    Contraseña
                                </label>
                                {/*funcionalidad pendiente desarollo deuda tecnica */}<a className="hidden block text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    type="button"
                                >
                                    <span className="material-icons text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-offset-0 dark:bg-slate-700 dark:border-slate-600"
                                id="remember"
                                type="checkbox"
                            />
                            <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="remember">
                                Recordarme
                            </label>
                        </div>

                        {/* Primary Action */}
                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            type="submit"
                        >
                            <span>Iniciar Sesión</span>
                            <span className="material-icons text-lg">arrow_forward</span>
                        </button>
                    </form>

                    {/* Security Badge */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-icons text-[14px]">verified_user</span>
                            Secure Session Active
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed max-w-[240px]">
                            Credentials and session data are protected with secure cookie storage and AES-256 end-to-end encryption.
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <footer className="mt-8 flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-primary transition-colors">Volver al Home</Link>
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">Help</a>
                </footer>

                {/* Background Decorative Elements */}
                <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-primary/30 rounded-full blur-[80px]"></div>
                </div>
            </main>
        </div>
    );
}
