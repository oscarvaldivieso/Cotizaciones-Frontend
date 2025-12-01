import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Viaje } from 'src/app/models/viaje.model';

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
export class ViajesService {

    private apiUrl = `${environment.apiUrl}/Viajes`;

    constructor(private http: HttpClient) { }

    /**
     * Lista todos los viajes
     */
    listarViajes(): Observable<ApiResponse<Viaje[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Viaje[]>>(`${this.apiUrl}/Listar`, {
            headers
        });
    }

    /**
     * Inserta un nuevo viaje
     */
    insertarViaje(viaje: Viaje): Observable<ApiResponse<Viaje>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<ApiResponse<Viaje>>(`${this.apiUrl}/Insertar`, viaje, {
            headers
        });
    }

    /**
     * Obtiene un viaje por ID
     */
    obtenerViaje(id: number): Observable<ApiResponse<Viaje>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Viaje>>(`${this.apiUrl}/Obtener/${id}`, {
            headers
        });
    }

    /**
     * Actualiza un viaje existente
     */
    actualizarViaje(viaje: Viaje): Observable<ApiResponse<Viaje>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.put<ApiResponse<Viaje>>(`${this.apiUrl}/Actualizar`, viaje, {
            headers
        });
    }

    /**
     * Elimina un viaje
     */
    eliminarViaje(id: number): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Eliminar/${id}`, {
            headers
        });
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

        console.error('❌ Error en servicio:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
