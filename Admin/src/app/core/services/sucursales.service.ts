import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sucursal} from 'src/app/models/sucursal.model';

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
export class SucursalesService {

    

  private apiUrl = `${environment.apiUrl}/Sucursales`;

  constructor(private http: HttpClient) { }

  listarSucursales(): Observable<ApiResponse<Sucursal[]>> {
    const headers = new HttpHeaders({
      'XApiKey': environment.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<ApiResponse<Sucursal[]>>(`${this.apiUrl}/Listar`, {
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
