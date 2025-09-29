export type Client = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type Portfolio = {
  id: string;
  client_id: string;
  nombre: string;
  tipo_portafolio: "Conservador" | "Moderado" | "Agresivo";
  moneda: string;
  importe_inicial: number;
  rendimiento_mensual_pct: number;
  plazo_meses: number;
  fecha_inicio: string;
  comision_retiro_pct: number;
  retiro_rend_programado: boolean;
  periodicidad_rend: "Mensual" | "Trimestral";
  aportacion_mensual: number | null;
  aportaciones_extra: { monto: number; fecha: string }[] | null;
  retiros_capital: { monto: number; fecha: string }[] | null;
  created_at: string;
  updated_at: string;
};

export type MonthlyRow = {
  mes: number;
  fecha: string;
  capital_inicial: number;
  aportacion_mensual: number;
  rendimiento_mx: number;
  rendimiento_acum: number;
  retiro_rend: number;
  comision_retiro: number;
  retiro_capital: number;
  capital_final: number;
};

export type KPIs = {
  capital_inicial_total: number;
  rend_bruto: number;
  comisiones: number;
  rend_neto: number;
  capital_final: number;
};
