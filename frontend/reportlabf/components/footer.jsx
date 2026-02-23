import { useState } from "react";


export function Footer() {
    return (
        <>
            <footer className="m-2 rounded-3xl border-2 border-gray-200 bg-gray-200 dark:bg-slate-800 dark:text-white overflow-hidden">
                <div className="p-8 md:grid md:grid-cols-2 lg:grid-cols-2 gap-8 items-center">
                    <p className="text-center">Footer</p>
                </div>
            </footer>
        </>
    );
}
