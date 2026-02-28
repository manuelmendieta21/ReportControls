from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd
from io import BytesIO
import os
import re
from dotenv import load_dotenv
from pydantic import BaseModel
from supabase import create_client, Client

app = FastAPI(title="Excel Processor Microservice")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
            partes = re.split(re.escape(cargo), texto_limpio, flags=re.IGNORECASE)
            nombre = partes[0].strip()
            return {"nombre": nombre, "cargo": cargo}

    return {"nombre": texto_limpio, "cargo": "N/A"}

def extract_data(file_bytes: bytes, filename: str):
    """Extract data based on coordinates."""
    try:
        file_stream = BytesIO(file_bytes)
        if filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream, header=None)
        else:
            df = pd.read_csv(file_stream, header=None)
        
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
        
        return extracted
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting data: {str(e)}")


class UploadResultsPayload(BaseModel):
    results: List[dict]


supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    global supabase_client
    if supabase_client is not None:
        return supabase_client

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_service_key:
        raise HTTPException(
            status_code=500,
            detail="Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en variables de entorno."
        )

    supabase_client = create_client(supabase_url, supabase_service_key)
    return supabase_client


def map_result_to_db_row(item: dict) -> dict:
    return {
        "archivo": item.get("ARCHIVO", "N/A"),
        "sede": item.get("Sede", "N/A"),
        "fecha": item.get("Fecha", "N/A"),
        "nombre_profesionales_que_reciben": item.get("NOMBRE PROFESIONALES QUE RECIBEN", "N/A"),
        "cargo_profesionales_que_reciben": item.get("CARGO PROFESIONALES QUE RECIBEN", "N/A"),
        "nombre_responsable_visita": item.get("NOMBRE RESPONSABLE DE VISITA", "N/A"),
        "cargo_responsable_visita": item.get("CARGO RESPONSABLE DE VISITA", "N/A"),
        "calificacion_obtenida": item.get("CALIFICACIÓN OBTENIDA", "N/A"),
        "clasificacion_riesgo": item.get("CLASIFICACIÓN POR RIESGO", "N/A"),
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/process-excel")
async def process_excel(file: UploadFile = File(...)):
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

@app.post("/api/process-batch")
async def process_batch(files: List[UploadFile] = File(...)):
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


@app.post("/api/upload-results")
async def upload_results(payload: UploadResultsPayload):
    if not payload.results:
        raise HTTPException(status_code=400, detail="No hay resultados para guardar.")

    try:
        table_name = os.getenv("SUPABASE_REPORTS_TABLE", "reportes_procesados")
        rows = [map_result_to_db_row(item) for item in payload.results]
        client = get_supabase_client()
        response = client.table(table_name).insert(rows).execute()
        inserted = len(response.data) if response.data else 0

        return JSONResponse(content={
            "ok": True,
            "inserted": inserted,
            "table": table_name
        })
    except HTTPException as exc:
        raise exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error guardando en Supabase: {str(e)}")


@app.get("/api/reports")
async def get_reports(limit: int = 50):
    try:
        table_name = os.getenv("SUPABASE_REPORTS_TABLE", "reportes_procesados")
        client = get_supabase_client()
        # Fetch reports ordered by created_at (assuming it exists) or id descending
        response = client.table(table_name).select("*").order("id", desc=True).limit(limit).execute()
        return JSONResponse(content=response.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo reportes: {str(e)}")


@app.get("/api/stats")
async def get_stats():
    try:
        table_name = os.getenv("SUPABASE_REPORTS_TABLE", "reportes_procesados")
        client = get_supabase_client()
        response = client.table(table_name).select("*").execute()
        data = response.data

        if not data:
            return JSONResponse(content={
                "total_visits": 0,
                "sedes_count": 0,
                "risks_detected": 0,
                "risks_distribution": {"alto": 0, "moderado": 0, "bajo": 0}
            })

        df = pd.DataFrame(data)
        
        # Simple stats
        total_visits = len(df)
        sedes_count = df['sede'].nunique() if 'sede' in df.columns else 0
        
        # Risk distribution
        risks_dist = {"alto": 0, "moderado": 0, "bajo": 0}
        if 'clasificacion_riesgo' in df.columns:
            for risk in df['clasificacion_riesgo']:
                risk_lower = str(risk).lower()
                if 'alto' in risk_lower: risks_dist["alto"] += 1
                elif 'bajo' in risk_lower: risks_dist["bajo"] += 1
                else: risks_dist["moderado"] += 1
        
        risks_detected = risks_dist["alto"] + risks_dist["moderado"]

        return JSONResponse(content={
            "total_visits": total_visits,
            "sedes_count": sedes_count,
            "risks_detected": risks_detected,
            "risks_distribution": risks_dist,
            "recent_reports": data[:5] # Last 5 for table
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas: {str(e)}")
