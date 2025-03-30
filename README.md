# ESG Lens

Plataforma para analizar, comparar y extraer información valiosa de informes ESG utilizando técnicas de procesamiento de lenguaje natural.

## Requisitos

- Node.js (v14 o superior)
- npm
- Python 3.8 o superior
- pip

## Estructura del Proyecto

- `frontend/`: Aplicación Next.js para la interfaz de usuario
- `backend/`: API FastAPI para el procesamiento de datos
- `run.sh`: Script para ejecutar ambos componentes de manera simultánea

## Instalación y Configuración

### Método 1: Script Automatizado

1. Haz el script ejecutable:
   ```
   chmod +x run.sh
   ```

2. Ejecuta el script:
   ```
   ./run.sh
   ```
   
3. El script configurará automáticamente el entorno virtual, instalará las dependencias y ejecutará tanto el backend como el frontend.

### Método 2: Configuración Manual

#### Backend

1. Navega al directorio del backend:
   ```
   cd backend
   ```

2. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

3. Activa el entorno virtual:
   - En Linux/Mac:
     ```
     source venv/bin/activate
     ```
   - En Windows:
     ```
     venv\Scripts\activate
     ```

4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

5. Ejecuta el servidor:
   ```
   python main.py
   ```

#### Frontend

1. Navega al directorio del frontend:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```

## Uso

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

## Funcionalidades

- Vista y búsqueda de informes ESG
- Análisis detallado de informes individuales
- Comparaciones entre informes
- Métricas y puntuaciones ESG

## Desarrollo

Este proyecto utiliza:
- NextJS y TypeScript para el frontend
- FastAPI y Python para el backend