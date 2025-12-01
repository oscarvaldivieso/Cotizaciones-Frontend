/**
 * Modelo de Sucursal
 * Representa una sucursal del sistema
 */
export class Sucursal {
  sucu_Id?: number;
  sucu_Codigo?: string;
  sucu_Nombre?: string;
  sucu_Direccion?: string;
  muni_Codigo?: string;
  sucu_Imagen?: string;
  usua_Creacion?: number;
  usua_Modificacion?: number | null;

  constructor(init?: Partial<Sucursal>) {
    Object.assign(this, init);
  }
}
