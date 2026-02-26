from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
from io import BytesIO
import uvicorn
import os

app = FastAPI(title="Excel Processor Microservice")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def limpiar_dato(valor):
    """Limpia y normaliza datos, maneja fechas correctamente."""
    if pd.isna(valor):
        return "N/A"

    if isinstance(valor, pd.Timestamp):
        return valor.strftime('%Y-%m-%d')

    resultado = str(valor).strip().replace('\n', ' ').replace('  ', ' ')
    
    # Extraer solo la fecha si tiene formato YYYY-MM-DD HH:MM:SS
    if ' ' in resultado and len(resultado.split()[0]) == 10:
        partes = resultado.split()
        if len(partes[0]) == 10 and partes[0].count('-') == 2:
            return partes[0]

    return resultado

def separar_profesional_cargo(texto):
    """Separa el nombre del cargo del profesional."""
    if not texto or texto == "N/A":
        return {"nombre": "N/A", "cargo": "N/A"}

    texto_limpio = str(texto).strip()
    cargos = [
        "Auxiliar de laboratorio", "Auxiliar de Laboratorio", "Bacteriologa",
        "Enfermería", "Enfermeria", "Profesional Enfermería", 
        "Profesional Enfermeria", "Profesional"
    ]

    for cargo in cargos:
        if cargo.lower() in texto_limpio.lower():
            # Usar split con case insensitive y límite para no romper nombres
            import re
            partes = re.split(re.escape(cargo), texto_limpio, flags=re.IGNORECASE)
            nombre = partes[0].strip()
            return {"nombre": nombre, "cargo": cargo}

    return {"nombre": texto_limpio, "cargo": "N/A"}

def extract_data(file_bytes: bytes, filename: str):
    """Extract data based on coordinates and advanced logic from reportinfo.py."""
    try:
        file_stream = BytesIO(file_bytes)
        if filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream, header=None)
        else:
            df = pd.read_csv(file_stream, header=None)

        # Extraction logic based on coordinates from reportinfo.py (snippet provided by user)
        # FECHA: iloc[5, 2], SEDE: iloc[6, 2], PROFESIONALES: iloc[7, 2], RESPONSABLE: iloc[8, 2]
        # CALIFICACIÓN: iloc[20, 2], RIESGO: iloc[21, 2]
        
        prof_reciben_raw = limpiar_dato(df.iloc[7, 2]) if df.shape[0] > 7 and df.shape[1] > 2 else "N/A"
        profesionales_lista = [p.strip() for p in prof_reciben_raw.split('\n') if p.strip() and p.strip() != "N/A"]
        
        profesionales_procesados = [separar_profesional_cargo(p) for p in profesionales_lista]
        nombres_profesionales = " | ".join([p['nombre'] for p in profesionales_procesados]) if profesionales_procesados else "N/A"
        cargos_profesionales = " | ".join([p['cargo'] for p in profesionales_procesados]) if profesionales_procesados else "N/A"

        responsable_raw = limpiar_dato(df.iloc[8, 2]) if df.shape[0] > 8 and df.shape[1] > 2 else "N/A"
        responsable = separar_profesional_cargo(responsable_raw)

        extracted = {
            "ARCHIVO": filename,
            "Sede": limpiar_dato(df.iloc[6, 2]) if df.shape[0] > 6 and df.shape[1] > 2 else "N/A",
            "Fecha": limpiar_dato(df.iloc[5, 2]) if df.shape[0] > 5 and df.shape[1] > 2 else "N/A",
            "NOMBRE PROFESIONALES QUE RECIBEN": nombres_profesionales,
            "CARGO PROFESIONALES QUE RECIBEN": cargos_profesionales,
            "NOMBRE RESPONSABLE DE VISITA": responsable['nombre'],
            "CARGO RESPONSABLE DE VISITA": responsable['cargo'],
            "CALIFICACIÓN OBTENIDA": limpiar_dato(df.iloc[20, 2]) if df.shape[0] > 20 and df.shape[1] > 2 else "N/A",
            "CLASIFICACIÓN POR RIESGO": limpiar_dato(df.iloc[21, 2]) if df.shape[0] > 21 and df.shape[1] > 2 else "N/A"
        }
        
        # Also include coordinates from the first prompt just in case
        if df.shape[0] > 29 and df.shape[1] > 3:
            extracted["Calificación Total"] = limpiar_dato(df.iloc[29, 3])
            extracted["Calificación Riesgo"] = limpiar_dato(df.iloc[30, 3])

        return extracted
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting data: {str(e)}")

@app.post("/process-excel")
async def process_excel(file: UploadFile = File(...)):
    """Endpoint with python-multipart to process files."""
    filename = file.filename.lower()
    if not (filename.endswith('.xlsx') or filename.endswith('.csv')):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    try:
        content = await file.read()
        data = extract_data(content, file.filename)
        return JSONResponse(content=data)
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-batch")
async def process_batch(files: List[UploadFile] = File(...)):
    """Endpoint to process multiple files simultaneously."""
    results = []
    errors = []
    
    for file in files:
        filename = file.filename.lower()
        if not (filename.endswith('.xlsx') or filename.endswith('.csv')):
            errors.append({"file": file.filename, "error": "Invalid file type."})
            continue
            
        try:
            content = await file.read()
            data = extract_data(content, file.filename)
            results.append(data)
        except Exception as e:
            errors.append({"file": file.filename, "error": str(e)})
            
    return JSONResponse(content={
        "processed_count": len(results),
        "total_count": len(files),
        "results": results,
        "errors": errors
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
