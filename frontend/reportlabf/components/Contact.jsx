import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);

        // Simulación de envío
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSending(false);
    };

    return (
        <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-800/30">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                            Contacto Directo
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
                            ¿Listo para Empezar?
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">
                            Escríbenos y lleva el control estadístico de tu empresa al siguiente nivel.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
                        {/* Info Overlay */}
                        <div className="md:w-1/3 bg-primary p-10 text-white flex flex-col justify-between">
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold">Información de Contacto</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined">mail</span>
                                        <span className="text-sm">soporte@datalab.com</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined">call</span>
                                        <span className="text-sm">+57 300 000 0000</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <span className="text-sm">Bogotá, Colombia</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                                    <span className="material-symbols-outlined text-sm">share</span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="md:w-2/3 p-10 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary transition-all dark:text-white"
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary transition-all dark:text-white"
                                        placeholder="juan@empresa.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asunto</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary transition-all dark:text-white"
                                    placeholder="¿En qué podemos ayudarte?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mensaje</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary transition-all dark:text-white resize-none"
                                    placeholder="Describe tu requerimiento..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                disabled={isSending}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSending ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar Mensaje</span>
                                        <span className="material-symbols-outlined">send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
