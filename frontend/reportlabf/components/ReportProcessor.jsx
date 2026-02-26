import { useState, useCallback } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useReport } from "../context/ReportContext";

export function ReportProcessor() {
    const {
        file, setFile,
        result, setResult,
        error, setError,
    } = useReport();

    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
            setFile(droppedFile);
            setError(null);
        } else {
            setError("Por favor sube un archivo .xlsx o .csv válido.");
        }
    }, []);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const processFile = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/process-excel", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al procesar el archivo");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DashboardLayout title="Procesador de Reportes">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Upload Section */}
                <section className="mb-8 border-dashed border-2 border-blue-500 rounded-2xl p-2 dark:border-slate-700 bg-blue-500/10  ">
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`
                            dashed-border bg-white dark:bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative
                            ${isDragging ? "bg-primary/5 scale-[1.02] border-primary" : "hover:bg-primary/5"}
                            ${file ? "bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-500/50" : ""}
                        `}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${file ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-green-50 dark:bg-green-900/20"}`}>
                            <span className={`material-symbols-outlined text-3xl ${file ? "text-emerald-600" : "text-green-600"}`}>
                                {file ? "task" : "description"}
                            </span>
                        </div>

                        {file ? (
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">{file.name}</h2>
                                <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 mx-auto"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Quitar archivo
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-2">Selecciona el archivo o arrastra y suelta</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
                                    Arrastra y suelta tu archivo Excel o CSV aquí para comenzar a analizar tus datos.
                                </p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={onFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        accept=".xlsx,.csv"
                                    />
                                    <button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center gap-2 pointer-events-none">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Browse Files
                                    </button>
                                </div>
                                <p className="mt-4 text-xs text-slate-400">Supported: .xlsx, .csv, .ods (Max 50MB)</p>
                            </>
                        )}
                    </div>
                </section>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/30">
                        <span className="material-symbols-outlined">error</span>
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        disabled={!file || isProcessing}
                        className="px-6 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50"
                        onClick={() => { setFile(null); setResult(null); }}
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!file || isProcessing}
                        onClick={processFile}
                        className={`
                            px-8 py-3 rounded-xl font-bold text-white transition flex items-center gap-2 shadow-lg
                            ${isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90 shadow-primary/20"}
                            disabled:opacity-50
                        `}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Procesar Ahora
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                Información Extraída
                            </h3>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-bold rounded-full uppercase">
                                Procesado con éxito
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                { label: "Archivo", value: result.ARCHIVO, icon: "attachment" },
                                { label: "Sede", value: result.Sede, icon: "domain" },
                                { label: "Fecha", value: result.Fecha, icon: "calendar_today" },
                                { label: "Calificación", value: result["CALIFICACIÓN OBTENIDA"], icon: "grade" },
                                { label: "Nivel de Riesgo", value: result["CLASIFICACIÓN POR RIESGO"], icon: "warning" },
                                { label: "Nombre Responsable", value: result["NOMBRE RESPONSABLE DE VISITA"], icon: "person" },
                                { label: "Cargo Responsable", value: result["CARGO RESPONSABLE DE VISITA"], icon: "badge" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                        {item.label}
                                    </div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg">
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                                <span className="material-symbols-outlined text-sm">groups</span>
                                Profesionales que Reciben
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result["NOMBRE PROFESIONALES QUE RECIBEN"].split(" | ").map((prof, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-slate-300 shadow-sm">
                                        {prof}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                                <span className="material-symbols-outlined">download</span>
                                Exportar a Base de Datos
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
