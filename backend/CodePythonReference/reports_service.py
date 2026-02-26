from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from io import BytesIO
import uvicorn
import os
from typing import List
from pathlib import Path

app = FastAPI(title="Reports Generation Microservice")

def limpiar_dato(valor):
    """Limpia y normaliza datos, maneja fechas correctamente"""
    if pd.isna(valor):
        return "N/A"

    # Si es una fecha/timestamp, convertir a string solo con la fecha
    if isinstance(valor, pd.Timestamp):
        return valor.strftime('%Y-%m-%d')

    resultado = str(valor).strip().replace('\n', ' ').replace('  ', ' ')

    # Si contiene patrón de fecha con hora, extraer solo la fecha
    if ' ' in resultado and len(resultado.split()[0]) == 10:
        partes = resultado.split()
        if len(partes[0]) == 10 and partes[0].count('-') == 2:  # Formato YYYY-MM-DD
            return partes[0]

    return resultado

def separar_profesional_cargo(texto):
    """
    Separa el nombre del cargo del profesional.
    """
    if not texto or texto == "N/A":
        return {"nombre": "N/A", "cargo": "N/A"}

    texto_limpio = str(texto).strip()

    # Lista de cargos a buscar (ordenada por mayor especificidad)
    cargos = [
        "Auxiliar de laboratorio",
        "Auxiliar de Laboratorio",
        "Bacteriólogo",
        "Bacteriologo",
        "Bacteriologo POCT",
        "Enfermería",
        "Enfermeria",
        "Profesional Enfermería",
        "Profesional Enfermeria",
        "Profesional"
    ]

    # Buscar cargo en el texto
    cargo_encontrado = None
    for cargo in cargos:
        if cargo.lower() in texto_limpio.lower():
            cargo_encontrado = cargo
            break

    # Si encontró cargo, separar nombre
    if cargo_encontrado:
        partes = texto_limpio.split(cargo_encontrado)
        nombre = partes[0].strip()
        return {"nombre": nombre, "cargo": cargo_encontrado}

    return {"nombre": texto_limpio, "cargo": "N/A"}

def extraer_datos_contenido(file_bytes: bytes, filename: str):
    """
    Extrae datos de un archivo (bytes) basándose en la lógica de reportinfo.py
    """
    try:
        extension = Path(filename).suffix.lower()
        file_stream = BytesIO(file_bytes)

        if extension == '.xlsx':
            df = pd.read_excel(file_stream, header=None)
        elif extension == '.csv':
            df = pd.read_csv(file_stream, header=None)
        else:
            return None

        # Datos de profesionales que reciben la visita
        prof_reciben_raw = limpiar_dato(df.iloc[7, 2]) if df.shape[0] > 7 and df.shape[1] > 2 else "N/A"
        profesionales_lista = [p.strip() for p in prof_reciben_raw.split('\n') if p.strip() and p.strip() != "N/A"]

        profesionales_procesados = []
        for prof in profesionales_lista:
            prof_data = separar_profesional_cargo(prof)
            profesionales_procesados.append(prof_data)

        # Datos del responsable de la visita
        responsable_raw = limpiar_dato(df.iloc[8, 2]) if df.shape[0] > 8 and df.shape[1] > 2 else "N/A"
        responsable = separar_profesional_cargo(responsable_raw)

        # Crear lista de profesionales en formato string
        nombres_profesionales = " | ".join([p['nombre'] for p in profesionales_procesados]) if profesionales_procesados else "N/A"
        cargos_profesionales = " | ".join([p['cargo'] for p in profesionales_procesados]) if profesionales_procesados else "N/A"

        datos = {
            'ARCHIVO': filename,
            'FECHA': limpiar_dato(df.iloc[5, 2]) if df.shape[0] > 5 and df.shape[1] > 2 else "N/A",
            'SEDE / CLIENTE': limpiar_dato(df.iloc[6, 2]) if df.shape[0] > 6 and df.shape[1] > 2 else "N/A",
            'NOMBRE PROFESIONALES QUE RECIBEN': nombres_profesionales,
            'CARGO PROFESIONALES QUE RECIBEN': cargos_profesionales,
            'NOMBRE RESPONSABLE DE VISITA': responsable['nombre'],
            'CARGO RESPONSABLE DE VISITA': responsable['cargo'],
            'CALIFICACIÓN OBTENIDA': limpiar_dato(df.iloc[20, 2]) if df.shape[0] > 20 and df.shape[1] > 2 else "N/A",
            'CLASIFICACIÓN POR RIESGO': limpiar_dato(df.iloc[21, 2]) if df.shape[0] > 21 and df.shape[1] > 2 else "N/A"
        }

        return datos
    except Exception as e:
        raise ValueError(f"Error procesando {filename}: {str(e)}")

@app.post("/process-report")
async def process_report(file: UploadFile = File(...)):
    """Procesa un solo archivo y devuelve el objeto JSON."""
    try:
        content = await file.read()
        extracted_data = extraer_datos_contenido(content, file.filename)
        if not extracted_data:
            raise HTTPException(status_code=400, detail="Formato de archivo no soportado")
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-batch")
async def process_batch(files: List[UploadFile] = File(...)):
    """Procesa múltiples archivos y devuelve una lista de resultados."""
    base_datos = []
    errors = []
    
    for file in files:
        try:
            content = await file.read()
            info = extraer_datos_contenido(content, file.filename)
            if info:
                base_datos.append(info)
        except Exception as e:
            errors.append({"archivo": file.filename, "error": str(e)})

    return {
        "resultados": base_datos,
        "errores": errors,
        "total_procesados": len(base_datos),
        "total_errores": len(errors)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.0", port=8001)
