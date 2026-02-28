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
        client = get_supabase_client()
        
        # 1. Obtener nombres de archivos en el payload
        filenames_in_payload = [item.get("ARCHIVO") for item in payload.results if item.get("ARCHIVO")]
        
        if not filenames_in_payload:
            # Si no hay nombres de archivos, procedemos normal (aunque no debería pasar)
            rows = [map_result_to_db_row(item) for item in payload.results]
            response = client.table(table_name).insert(rows).execute()
            return JSONResponse(content={"ok": True, "inserted": len(response.data)})

        # 2. Consultar cuáles de estos archivos YA existen en la DB
        existing_response = client.table(table_name).select("archivo").in_("archivo", filenames_in_payload).execute()
        existing_filenames = {row["archivo"] for row in existing_response.data} if existing_response.data else set()

        # 3. Filtrar los que NO están en la DB
        rows_to_insert = [
            map_result_to_db_row(item) 
            for item in payload.results 
            if item.get("ARCHIVO") not in existing_filenames
        ]

        if not rows_to_insert:
            # Todos son duplicados
            return JSONResponse(
                status_code=409,
                content={
                    "ok": False,
                    "message": "Todos los archivos ya han sido cargados anteriormente.",
                    "skipped": len(payload.results)
                }
            )

        # 4. Insertar solo los nuevos
        response = client.table(table_name).insert(rows_to_insert).execute()
        inserted_count = len(response.data) if response.data else 0
        skipped_count = len(payload.results) - inserted_count

        return JSONResponse(content={
            "ok": True,
            "inserted": inserted_count,
            "skipped": skipped_count,
            "message": f"Se cargaron {inserted_count} nuevos registros." + (f" Se omitieron {skipped_count} por ser duplicados." if skipped_count > 0 else "")
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
async def get_stats(start_date: Optional[str] = None, end_date: Optional[str] = None):
    try:
        table_name = os.getenv("SUPABASE_REPORTS_TABLE", "reportes_procesados")
        client = get_supabase_client()
        
        query = client.table(table_name).select("*")
        
        # Filtrar por fecha si se proporcionan
        if start_date:
            query = query.gte("fecha", start_date)
        if end_date:
            query = query.lte("fecha", end_date)
            
        response = query.order("fecha", desc=True).execute()
        data = response.data

        if not data:
            return JSONResponse(content={
                "total_visits": 0,
                "sedes_count": 0,
                "risks_detected": 0,
                "visits_this_month": 0,
                "risks_distribution": {"alto": 0, "moderado": 0, "bajo": 0},
                "visits_by_personnel": [],
                "recent_reports": []
            })

        df = pd.DataFrame(data)
        
        # Estadísticas básicas
        total_visits = len(df)
        sedes_count = df['sede'].nunique() if 'sede' in df.columns else 0
        
        # Distribución de riesgos
        risks_dist = {"alto": 0, "moderado": 0, "bajo": 0}
        if 'clasificacion_riesgo' in df.columns:
            for risk in df['clasificacion_riesgo']:
                risk_lower = str(risk).lower()
                if 'alto' in risk_lower: risks_dist["alto"] += 1
                elif 'bajo' in risk_lower: risks_dist["bajo"] += 1
                else: risks_dist["moderado"] += 1
        
        risks_detected = risks_dist["alto"] + risks_dist["moderado"]

        # Visitas este mes
        from datetime import datetime
        now = datetime.now()
        current_month_str = now.strftime('%Y-%m')
        
        visits_this_month = 0
        if 'fecha' in df.columns:
            visits_this_month = len(df[df['fecha'].str.startswith(current_month_str)])

        # Visitas por responsable
        personnel_stats = []
        if 'nombre_responsable_visita' in df.columns:
            personnel_counts = df['nombre_responsable_visita'].value_counts()
            personnel_stats = [
                {"nombre": name, "cantidad": int(count)} 
                for name, count in personnel_counts.items()
            ]

        return JSONResponse(content={
            "total_visits": total_visits,
            "sedes_count": sedes_count,
            "risks_detected": risks_detected,
            "visits_this_month": visits_this_month,
            "risks_distribution": risks_dist,
            "visits_by_personnel": personnel_stats[:10], # Top 10 responsables
            "recent_reports": data[:10] # Últimos 10 registros
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas: {str(e)}")
