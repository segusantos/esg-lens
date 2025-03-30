# Directorio de Datos de ESG Lens

Este directorio contiene los datos procesados y almacenados por la aplicación ESG Lens.

## Estructura

- `reports/`: Contiene los informes ESG procesados almacenados como archivos JSON
  - Cada informe se guarda con su ID como nombre de archivo (ejemplo: `123e4567-e89b-12d3-a456-426614174000.json`)

## Formato de Datos

Cada archivo JSON contiene un informe ESG completo con la siguiente estructura:

```json
{
  "id": "string",
  "company": "string",
  "ticker": "string",
  "year": 0,
  "industry": "string",
  "esg_score": 0,
  "environment_score": 0,
  "social_score": 0,
  "governance_score": 0,
  "report_quality": "string",
  "publish_date": "string",
  "file_url": "string",
  "website_url": "string",
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "key_metrics": {
    "metric_name": "metric_value"
  }
}
```

## Notas

- Los informes se cargan automáticamente en la aplicación al inicio
- Los nuevos informes procesados se guardan automáticamente en este directorio
- No modifique manualmente estos archivos a menos que sea necesario 