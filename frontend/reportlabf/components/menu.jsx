import { useState } from "react";

export function Menu() {
    return (
        <> <menu class=" bg-gray-200 bg-blue-cyan dark:text-white h-screen" >
            <section class="p-4 items-center justify-center">
                <div className="xs:gap-2 m-2 rounded-3xl p-4 text-white md:grid md:grid-cols-2">
                    <h1 className="text-3xl md:col-span-3 md:m-5">Control de Estadistica Servicios</h1>
                    <h2 className="m-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, harum? Dolores laudantium ducimus facere quaerat eligendi veniam fuga similique accusantium, eum nesciunt harum, quos iusto minima dicta error id fugit.</h2>

                    <img
                        src="./public/img/newImage1.png"
                        alt="phone images and data"
                        className="md:w-lg dark:bg-white rounded-3xl p-2 "
                    />

                    <div className="flex justify-center"
                    ><button class="text-2xl bg-green-600 border-l-inherit hover:bg-green-800 transition-all duration-300 text-white p-2 rounded-lg mt-7 dark:bg-green-900 dark:text-white dark:hover:bg-green-300">
                            <a href="#">Contactanos</a>
                        </button></div>
                </div>
            </section>

        </menu>
        </>
    );
}