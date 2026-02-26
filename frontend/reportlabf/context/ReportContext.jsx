import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export function ReportProvider({ children }) {
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [uploadMode, setUploadMode] = useState('individual'); // 'individual' or 'batch'
    const [error, setError] = useState(null);

    const clearState = () => {
        setFiles([]);
        setResults([]);
        setError(null);
    };

    return (
        <ReportContext.Provider value={{
            files, setFiles,
            results, setResults,
            uploadMode, setUploadMode,
            error, setError,
            clearState
        }}>
            {children}
        </ReportContext.Provider>
    );
}

export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("useReport must be used within a ReportProvider");
    }
    return context;
};
