"""
Utilidades para exportación de datos a CSV.
"""
import csv
from io import StringIO
from django.http import HttpResponse


def export_to_csv(queryset, fields, filename="export.csv"):
    """
    Exporta un queryset a CSV.
    
    Args:
        queryset: QuerySet de Django
        fields: Lista de campos a exportar
        filename: Nombre del archivo de salida
    
    Returns:
        HttpResponse con el CSV
    """
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.write('\ufeff')  # BOM for Excel UTF-8 support
    
    writer = csv.writer(response)
    
    # Write header
    headers = [field.replace('_', ' ').title() for field in fields]
    writer.writerow(headers)
    
    # Write data
    for obj in queryset:
        row = []
        for field in fields:
            value = getattr(obj, field, '')
            # Handle display methods like get_FOO_display()
            if hasattr(obj, f'get_{field}_display'):
                value = getattr(obj, f'get_{field}_display')()
            row.append(value)
        writer.writerow(row)
    
    return response


def queryset_to_csv_string(queryset, fields):
    """
    Convierte un queryset a string CSV (para usar en otras funciones).
    """
    output = StringIO()
    writer = csv.writer(output)
    
    # Header
    headers = [field.replace('_', ' ').title() for field in fields]
    writer.writerow(headers)
    
    # Data
    for obj in queryset:
        row = [getattr(obj, field, '') for field in fields]
        writer.writerow(row)
    
    return output.getvalue()
