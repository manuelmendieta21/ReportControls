import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export function ReportProvider({ children }) {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const clearState = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    return (
        <ReportContext.Provider value={{
            file, setFile,
            result, setResult,
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
