import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

export function Sesion() {
    const [user, setUser] = useState("");
    const [role, setRole] = useState("");

    const navigate = useNavigate();
    const handleLogout = () => {
        // Limpiamos los datos de sesión del navegador
        localStorage.clear();
        console.log("Cerrando sesión...");
        navigate("/login");
    };
    useEffect(
        () => {
            const loggedUser = localStorage.getItem("user");
            const loggedRole = localStorage.getItem("role");
            console.log(loggedUser);
            console.log(loggedRole);
            if (loggedUser) {
                setUser(JSON.parse(loggedUser));
                setRole(JSON.parse(loggedRole));
            }
        },
        []
    );
    if (!user) {
        <ProtectedRoute>
            return null;
        </ProtectedRoute>
    }

    return (
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
                    <p className="text-[12px] font-semibold truncate">{user}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{role}</p>
                </div>
            </div>
        </div>
    );
}





