import { useState, useCallback } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useReport } from "../context/ReportContext";

export function ReportProcessor() {
    const {
        files, setFiles,
        results, setResults,
        uploadMode, setUploadMode,
        error, setError,
        clearState
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

    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(f =>
            f.name.endsWith('.xlsx') || f.name.endsWith('.csv')
        );

        if (validFiles.length === 0) {
            setError("Por favor sube archivos .xlsx o .csv válidos.");
            return;
        }

        if (uploadMode === 'individual') {
            setFiles([validFiles[0]]);
        } else {
            setFiles(prev => [...prev, ...validFiles]);
        }
        setError(null);
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [uploadMode]);

    const onFileChange = (e) => {
        handleFiles(e.target.files);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const processFiles = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setError(null);
        setResults([]);

        const formData = new FormData();

        if (uploadMode === 'individual') {
            formData.append("file", files[0]);
            try {
                const response = await fetch("http://localhost:8000/process-excel", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) throw new Error("Error al procesar el archivo");
                const data = await response.json();
                setResults([data]);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsProcessing(false);
            }
        } else {
            files.forEach(file => formData.append("files", file));
            try {
                const response = await fetch("http://localhost:8000/process-batch", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) throw new Error("Error al procesar el lote de archivos");
                const data = await response.json();
                setResults(data.results);
                if (data.errors && data.errors.length > 0) {
                    setError(`Se procesaron ${data.processed_count} archivos, pero hubo errores en ${data.errors.length}.`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <DashboardLayout title="Procesador de Reportes">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Mode Selector */}
                <div className="flex justify-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => { setUploadMode('individual'); clearState(); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${uploadMode === 'individual' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Individual
                        </button>
                        <button
                            onClick={() => { setUploadMode('batch'); clearState(); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${uploadMode === 'batch' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Masivo (Batch)
                        </button>
                    </div>
                </div>

                {/* Upload Section */}
                <section className={`transition-all duration-300 ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}>
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`
                            dashed-border bg-white dark:bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative rounded-2xl border-2 border-dashed
                            ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-200 dark:border-slate-700 hover:border-primary/50"}
                            ${files.length > 0 ? "border-emerald-500/50 bg-emerald-50/10" : ""}
                        `}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${files.length > 0 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-blue-50 dark:bg-blue-900/20 text-primary"}`}>
                            <span className="material-symbols-outlined text-3xl">
                                {uploadMode === 'individual' ? 'description' : 'dynamic_feed'}
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold mb-2 dark:text-white">
                            {uploadMode === 'individual' ? "Selecciona un archivo" : "Selecciona múltiples archivos"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
                            {uploadMode === 'individual'
                                ? "Arrastra tu archivo Excel o CSV aquí."
                                : "Arrastra todos tus archivos Excel o CSV aquí para procesarlos en lote."}
                        </p>

                        <div className="relative">
                            <input
                                type="file"
                                multiple={uploadMode === 'batch'}
                                onChange={onFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                accept=".xlsx,.csv"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 pointer-events-none">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((f, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        <div className="truncate">
                                            <p className="text-sm font-semibold dark:text-white truncate">{f.name}</p>
                                            <p className="text-xs text-slate-500">{(f.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/30">
                        <span className="material-symbols-outlined">error</span>
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        disabled={files.length === 0 || isProcessing}
                        className="px-6 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50"
                        onClick={clearState}
                    >
                        Limpiar Todo
                    </button>
                    <button
                        disabled={files.length === 0 || isProcessing}
                        onClick={processFiles}
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
                                {uploadMode === 'individual' ? "Procesar Archivo" : `Procesar ${files.length} Archivos`}
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold dark:text-white">Resultados del Procesamiento</h3>
                            <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Exportar Todo
                            </button>
                        </div>

                        {uploadMode === 'individual' ? (
                            <ResultCard result={results[0]} />
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                                <th className="px-6 py-4">Archivo</th>
                                                <th className="px-6 py-4">Sede</th>
                                                <th className="px-6 py-4">Fecha</th>
                                                <th className="px-6 py-4">Calificación</th>
                                                <th className="px-6 py-4 text-center">Riesgo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {results.map((res, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium dark:text-white max-w-[200px] truncate">{res.ARCHIVO}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{res.Sede}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{res.Fecha}</td>
                                                    <td className="px-6 py-4 font-bold text-primary">{res["CALIFICACIÓN OBTENIDA"]}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${res["CLASIFICACIÓN POR RIESGO"].toLowerCase().includes('bajo') ? 'bg-emerald-100 text-emerald-600' :
                                                                res["CLASIFICACIÓN POR RIESGO"].toLowerCase().includes('alto') ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {res["CLASIFICACIÓN POR RIESGO"]}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function ResultCard({ result }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    {result.ARCHIVO}
                </h3>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-bold rounded-full uppercase">
                    Procesado con éxito
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
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
        </div>
    );
}
