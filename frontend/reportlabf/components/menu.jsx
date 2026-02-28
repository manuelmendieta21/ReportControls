export function Menu() {
    return (
        <section className="m-2 rounded-3xl border-2 border-gray-200 bg-gray-200 dark:bg-slate-800 dark:text-white overflow-hidden">
            <div className="p-8 md:grid md:grid-cols-2 lg:grid-cols-2 gap-8 items-center">

                {/* Lado Izquierdo: Contenido */}
                <div className="flex flex-col space-y-6">
                    <h1 className="text-blue-mayus text-3xl lg:text-5xl font-bold text-center md:text-left">
                        Control de Estadística Servicios
                    </h1>

                    <div className="flex flex-col gap-4">
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, harum?
                            Dolores laudantium ducimus facere quaerat eligendi veniam fuga.
                        </p>

                        {/* Imagen pequeña decorativa opcional */}
                        <img
                            src="/img/linechart.png"
                            alt="Gráfico de líneas"
                            className="w-32 self-center md:self-start hidden sm:block"
                        />
                    </div>
                    <div className="flex justify-center md:justify-start">
                        <a
                            href="#contact"
                            className="inline-block text-xl dark:bg-blue-mayus bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                        >
                            Contactanos
                        </a>
                    </div>
                </div>

                {/* Lado Derecho: Imagen Principal */}
                <div className="mt-8 md:mt-0 flex justify-center">
                    <img
                        src="/img/newImage1.png"
                        alt="Estadísticas en dispositivos móviles"
                        className="w-full max-w-md rounded-3xl shadow-xl transition-transform hover:scale-105"
                    />
                </div>
            </div>
        </section>
    );
}