import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="p-4 text-gray-300 relative">
                <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur text-slate-800 text-sm">
                    <Link to="/">
                        <img
                            src="./public/img/DataLabLogo.png"
                            alt="Logo DataLab"
                            className="w-45 dark:bg-white"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-row items-center gap-8 justify-end">
                        <ul className="flex flex-row gap-8 items-center m-0 p-0">
                            <li className="hover:text-green-400 list-none text-black">
                                <Link to="/" className="transition">Home</Link>
                            </li>
                            <li className="hover:text-green-400 list-none text-black">
                                <a href="#" className="transition">About</a>
                            </li>
                            <li className="hover:text-green-400 list-none text-black">
                                <a href="#" className="transition">Contactanos</a>
                            </li>
                            <li className="list-none">
                                <Link to="/login" className="transition">
                                    <button className="hover:bg-blue-800 transition-all duration-300 active:scale-110 dark:bg-blue-400 dark:text-white bg-blue-500 text-white p-2 rounded-lg">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden active:scale-110 transition-all duration-300">
                        <button onClick={toggleMenu} id="openMenu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucideMenuIcon lucideMenu bg-white">
                                <path d="M4 5h16" />
                                <path d="M4 12h16" />
                                <path d="M4 19h16" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Links */}
                <div
                    id="mobileNavLinks"
                    className={`fixed top-0 left-0 w-full h-full bg-white transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
                >
                    <div className="flex flex-col p-8 gap-6 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <img
                                src="./public/img/DataLabLogo.png"
                                alt="Logo DataLab"
                                className="w-32"
                            />
                            <button id="closeMenu" onClick={toggleMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" className="text-black" />
                                    <path d="m6 6 12 12" className="text-black" />
                                </svg>
                            </button>
                        </div>
                        <ul className="flex flex-col gap-6 m-0 p-0 text-black ">
                            <li className="list-none text-lg">
                                <Link to="/" onClick={toggleMenu} className="">Home</Link>
                            </li>
                            <li className="list-none text-lg">
                                <a href="#" onClick={toggleMenu} className="">About</a>
                            </li>
                            <li className="list-none text-lg">
                                <a href="#" onClick={toggleMenu} className="">Contactanos</a>
                            </li>
                            <li className="list-none">
                                <Link to="/login" onClick={toggleMenu} className="block w-full">
                                    <button className="dark:bg-blue-400 bg-blue-500 text-lg w-full  dark:text-white text-black p-3 rounded-lg hover:bg-green-700 transition">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}