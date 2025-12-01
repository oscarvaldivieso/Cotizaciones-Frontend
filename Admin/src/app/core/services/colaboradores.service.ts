import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Colaborador } from 'src/app/models/colaborador.model';

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
export class ColaboradoresService {

    private apiUrl = `${environment.apiUrl}/Colaboradores`;

    constructor(private http: HttpClient) { }

    listarColaboradores(): Observable<ApiResponse<Colaborador[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Colaborador[]>>(`${this.apiUrl}/Listar`, {
            headers
        });
    }

    listarColaboradoresPorSucursal(sucu_Id: number): Observable<ApiResponse<Colaborador[]>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ApiResponse<Colaborador[]>>(`${this.apiUrl}/ListarPorSucursal/${sucu_Id}`, {
            headers
        });
    }

    /**
     * Elimina un colaborador por ID
     */
    eliminarColaborador(id: number): Observable<ApiResponse<any>> {
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
     * Inserta un nuevo colaborador con sucursales asignadas
     */
    insertarColaborador(colaborador: any): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders({
            'XApiKey': environment.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Insertar`, colaborador, {
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
