import pandas as pd
import os
import glob
from pathlib import Path

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
    Busca palabras clave: 'Enfermería', 'Enfermeria', 'Auxiliar de laboratorio', 'Bacteriólogo', etc.
    Retorna: {nombre: str, cargo: str}
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

def extraer_datos_visita(ruta_archivo):
    """
    Extrae datos de archivos XLSX
    Estructura del archivo:
    - Fila 5, Col 2: FECHA
    - Fila 6, Col 2: SEDE / CLIENTE
    - Fila 7, Col 2: PROFESIONALES QUE RECIBEN LA VISITA
    - Fila 8, Col 2: RESPONSABLE DE REALIZAR LA VISITA
    - Fila 20, Col 2: CALIFICACIÓN OBTENIDA
    - Fila 21, Col 2: CLASIFICACIÓN POR RIESGO
    """
    try:
        extension = Path(ruta_archivo).suffix.lower()

        # Detectar tipo de archivo
        if extension == '.xlsx':
            df = pd.read_excel(ruta_archivo, header=None)
        elif extension == '.csv':
            df = pd.read_csv(ruta_archivo, header=None)
        else:
            print(f"Formato no soportado: {extension}")
            return None

        # Extracción de datos por coordenadas correctas (usando indexación desde 0)
        # Fila 5 (índice 5), Columna 2 (índice 2) = FECHA
        # Fila 6 (índice 6), Columna 2 (índice 2) = SEDE / CLIENTE
        # Fila 7 (índice 7), Columna 2 (índice 2) = PROFESIONALES QUE RECIBEN
        # Fila 8 (índice 8), Columna 2 (índice 2) = RESPONSABLE DE VISITA
        # Fila 20 (índice 20), Columna 2 (índice 2) = CALIFICACIÓN OBTENIDA
        # Fila 21 (índice 21), Columna 2 (índice 2) = CLASIFICACIÓN POR RIESGO

        # Datos de profesionales que reciben la visita (puede haber múltiples)
        prof_reciben_raw = limpiar_dato(df.iloc[7, 2]) if df.shape[0] > 7 and df.shape[1] > 2 else "N/A"

        # Dividir por salto de línea si hay múltiples profesionales
        profesionales_lista = [p.strip() for p in prof_reciben_raw.split('\n') if p.strip() and p.strip() != "N/A"]

        # Procesar cada profesional
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
            'ARCHIVO': os.path.basename(ruta_archivo),
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
        print(f"❌ Error al procesar {os.path.basename(ruta_archivo)}: {e}")
        return None

# --- CONFIGURACIÓN DE CARPETAS ---
carpeta_input ='./'
print(f"📁 Buscando archivos en: {carpeta_input}\n")

# Buscar archivos CSV y XLSX (excluyendo reportes generados)
todos_archivos = glob.glob(os.path.join(carpeta_input, "*.xlsx")) + glob.glob(os.path.join(carpeta_input, "*.csv"))
archivos = [f for f in todos_archivos if not os.path.basename(f).startswith("Reporte_")]

if not archivos:
    print("⚠️  No se encontraron archivos CSV o XLSX")
else:
    print(f"✅ Se encontraron {len(archivos)} archivo(s)\n")

    base_datos = []
    for f in archivos:
        print(f"📄 Procesando: {os.path.basename(f)}")
        info = extraer_datos_visita(f)
        if info:
            base_datos.append(info)

    if base_datos:
        # Convertir a DataFrame y guardar
        df_final = pd.DataFrame(base_datos)

        # Guardar en Excel con formato
        output_file = os.path.join(carpeta_input, "Reporte_Consolidado_INFO.xlsx")
        df_final.to_excel(output_file, index=False, sheet_name="Reportes")

        print(f"\n✅ Reporte generado exitosamente:")
        print("----------------------------------------------------------------------")
        print(f"   📊 Archivo: {output_file}")
        print(f"   📈 Registros: {len(df_final)}")
        print(f"\n{df_final.to_string()}")
    else:
        print("⚠️  No se pudo procesar ningún archivo")