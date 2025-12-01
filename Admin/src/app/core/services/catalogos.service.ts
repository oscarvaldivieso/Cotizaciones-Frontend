import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TipoSeguro } from 'src/app/models/tipo-seguro.model';
import { TipoCliente } from 'src/app/models/tipo-cliente.model';
import { Moneda } from 'src/app/models/moneda.model';

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
export class CatalogosService {

    private apiUrl = `${environment.apiUrl}/Clientes`;

    constructor(private http: HttpClient) { }

    /**
     * Listar todos los tipos de seguro
     */
    listarTiposSeguro(): Observable<ApiResponse<TipoSeguro[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<TipoSeguro[]>>(`${this.apiUrl}/TiposSeguro`, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Listar todos los tipos de cliente
     */
    listarTiposCliente(): Observable<ApiResponse<TipoCliente[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<TipoCliente[]>>(`${this.apiUrl}/TiposCliente`, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Listar todas las monedas
     */
    listarMonedas(): Observable<ApiResponse<Moneda[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Moneda[]>>(`${this.apiUrl}/Monedas`, {
            headers
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

        console.error('❌ Error en servicio de catálogos:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
