import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Bootstrap modules
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

// Services
import { CotizacionesService } from 'src/app/core/services/cotizaciones.service';
import { CatalogosService } from 'src/app/core/services/catalogos.service';

// Models
import { Cotizacion } from 'src/app/models/cotizacion.model';
import { TipoSeguro } from 'src/app/models/tipo-seguro.model';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    BsDatepickerModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit, OnDestroy {

  cotizaciones: Cotizacion[] = [];
  isLoading = false;
  errorMessage = '';

  filtrosForm!: UntypedFormGroup;
  tiposSeguro: TipoSeguro[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private cotizacionesService: CotizacionesService,
    private catalogosService: CatalogosService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarTiposSeguro();
    this.generarReporte();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario de filtros
   */
  inicializarFormulario(): void {
    this.filtrosForm = this.fb.group({
      fechaInicio: [null],
      fechaFin: [null],
      tiSe_Id: [null]
    });
  }

  /**
   * Carga los tipos de seguro para el filtro
   */
  cargarTiposSeguro(): void {
    this.catalogosService.listarTiposSeguro()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposSeguro = response.data;
          }
        },
        error: (error) => {
          console.error('Error al cargar tipos de seguro:', error);
        }
      });
  }

  /**
   * Genera el reporte con los filtros aplicados
   */
  generarReporte(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filtros = this.filtrosForm.value;

    // Formatear fechas si existen
    const fechaInicio = filtros.fechaInicio ? this.formatDate(filtros.fechaInicio) : null;
    const fechaFin = filtros.fechaFin ? this.formatDate(filtros.fechaFin) : null;
    const tiSe_Id = filtros.tiSe_Id || null;

    this.cotizacionesService.obtenerReporte(fechaInicio, fechaFin, tiSe_Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.cotizaciones = response.data;
            console.log('✅ Reporte generado:', this.cotizaciones.length, 'cotizaciones');
          } else {
            this.errorMessage = response.message || 'Error al generar el reporte';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al generar el reporte';
          console.error('❌ Error:', error);
        }
      });
  }

  /**
   * Limpia los filtros y regenera el reporte
   */
  limpiarFiltros(): void {
    this.filtrosForm.reset({
      fechaInicio: null,
      fechaFin: null,
      tiSe_Id: null
    });
    this.generarReporte();
  }

  /**
   * Formatea una fecha al formato YYYY-MM-DD
   */
  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcula el total de suma asegurada
   */
  getTotalSumaAsegurada(): number {
    return this.cotizaciones.reduce((sum, c) => sum + c.coti_SumaAsegurada, 0);
  }

  /**
   * Calcula el total de prima neta
   */
  getTotalPrimaNeta(): number {
    return this.cotizaciones.reduce((sum, c) => sum + c.coti_PrimaNeta, 0);
  }

  /**
   * Exportar a Excel con formato estético
   */
  exportarExcel(): void {
    if (this.cotizaciones.length === 0) {
      return;
    }

    // Importar dinámicamente xlsx
    import('xlsx').then(XLSX => {
      // Preparar datos para Excel
      const datos = this.cotizaciones.map(c => ({
        'Número': c.coti_Numero,
        'Fecha': c.fechaFormateada,
        'Cliente': c.clie_Nombre,
        'Tipo Cliente': c.tipoCliente,
        'Identidad': c.clie_Identidad,
        'Teléfono': c.clie_Telefono,
        'Tipo Seguro': c.tipoSeguro,
        'Descripción del Bien': c.coti_DescripcionBien,
        'Moneda': c.mone_Codigo,
        'Suma Asegurada': c.coti_SumaAsegurada,
        'Tasa %': c.coti_TasaPorcentaje,
        'Prima Neta': c.coti_PrimaNeta,
        'Correo Enviado': c.correoEnviadoTexto
      }));

      // Agregar fila de totales
      const totalesRow: any = {
        'Número': '',
        'Fecha': '',
        'Cliente': '',
        'Tipo Cliente': '',
        'Identidad': '',
        'Teléfono': '',
        'Tipo Seguro': '',
        'Descripción del Bien': 'TOTALES',
        'Moneda': '',
        'Suma Asegurada': this.getTotalSumaAsegurada(),
        'Tasa %': '',
        'Prima Neta': this.getTotalPrimaNeta(),
        'Correo Enviado': ''
      };
      datos.push(totalesRow);

      // Crear worksheet
      const ws = XLSX.utils.json_to_sheet(datos);

      // Configurar anchos de columna
      const colWidths = [
        { wch: 18 },  // Número
        { wch: 12 },  // Fecha
        { wch: 30 },  // Cliente
        { wch: 15 },  // Tipo Cliente
        { wch: 15 },  // Identidad
        { wch: 12 },  // Teléfono
        { wch: 20 },  // Tipo Seguro
        { wch: 40 },  // Descripción
        { wch: 10 },  // Moneda
        { wch: 18 },  // Suma Asegurada
        { wch: 10 },  // Tasa
        { wch: 15 },  // Prima Neta
        { wch: 15 }   // Correo Enviado
      ];
      ws['!cols'] = colWidths;

      // Crear workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Cotizaciones');

      // Generar nombre de archivo con fecha
      const fecha = new Date();
      const nombreArchivo = `Reporte_Cotizaciones_${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(wb, nombreArchivo);
    });
  }
}
