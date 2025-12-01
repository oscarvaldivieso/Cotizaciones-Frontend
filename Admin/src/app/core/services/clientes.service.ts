import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cliente } from 'src/app/models/cliente.model';

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
export class ClientesService {

    private apiUrl = `${environment.apiUrl}/Clientes`;

    constructor(private http: HttpClient) { }

    /**
     * Listar todos los clientes
     */
    listarClientes(): Observable<ApiResponse<Cliente[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Cliente[]>>(`${this.apiUrl}/Listar`, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Insertar un nuevo cliente
     */
    insertarCliente(cliente: Cliente): Observable<ApiResponse<Cliente>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<ApiResponse<Cliente>>(`${this.apiUrl}/Insertar`, cliente, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Actualizar un cliente existente
     */
    actualizarCliente(cliente: Cliente): Observable<ApiResponse<Cliente>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/Actualizar`, cliente, {
            headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Eliminar un cliente por ID
     */
    eliminarCliente(clie_Id: number): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Eliminar/${clie_Id}`, {
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

        console.error('❌ Error en servicio de clientes:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
