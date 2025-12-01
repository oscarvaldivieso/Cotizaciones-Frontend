import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cotizacion } from 'src/app/models/cotizacion.model';
import { CotizacionInsert } from 'src/app/models/cotizacion-insert.model';

interface ApiResponse<T> {
    type: number;
    code: number;
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class CotizacionesService {

    private apiUrl = `${environment.apiUrl}/Cotizaciones`;

    constructor(private http: HttpClient) { }

    /**
     * Listar todas las cotizaciones (reporte)
     * @param fechaInicio - Fecha de inicio del filtro (opcional)
     * @param fechaFin - Fecha de fin del filtro (opcional)
     * @param tiSe_Id - ID del tipo de seguro para filtrar (opcional)
     */
    listarCotizaciones(
        fechaInicio: string | null = null,
        fechaFin: string | null = null,
        tiSe_Id: number | null = null
    ): Observable<ApiResponse<Cotizacion[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        const body = {
            fechaInicio,
            fechaFin,
            tiSe_Id
        };

        return this.http.post<ApiResponse<Cotizacion[]>>(`${this.apiUrl}/Reporte`, body, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtener reporte de cotizaciones con filtros opcionales
     * @param fechaInicio - Fecha de inicio del filtro (opcional)
     * @param fechaFin - Fecha de fin del filtro (opcional)
     * @param tiSe_Id - ID del tipo de seguro para filtrar (opcional)
     */
    obtenerReporte(
        fechaInicio: string | null = null,
        fechaFin: string | null = null,
        tiSe_Id: number | null = null
    ): Observable<ApiResponse<Cotizacion[]>> {
        return this.listarCotizaciones(fechaInicio, fechaFin, tiSe_Id);
    }

    /**
     * Insertar una nueva cotización
     * Solo requiere: clie_Id, tiSe_Id, mone_Id, coti_DescripcionBien, coti_SumaAsegurada
     */
    insertarCotizacion(cotizacion: CotizacionInsert): Observable<ApiResponse<Cotizacion>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<ApiResponse<Cotizacion>>(`${this.apiUrl}/Insertar`, cotizacion, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Actualizar una cotización existente
     */
    actualizarCotizacion(cotizacion: Cotizacion): Observable<ApiResponse<Cotizacion>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.put<ApiResponse<Cotizacion>>(`${this.apiUrl}/Actualizar`, cotizacion, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Eliminar una cotización por ID
     */
    eliminarCotizacion(coti_Id: number): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Eliminar`, {
            headers,
            body: { coti_Id }
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Maneja los errores de las peticiones HTTP
     */
    private handleError(error: any) {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
        }

        console.error('❌ Error en servicio de cotizaciones:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
