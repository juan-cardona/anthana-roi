import { addMonths, formatISO } from "date-fns";
import type { KPIs, MonthlyRow, Portfolio } from "@/types";

export function computeMonthly(port: Portfolio): { rows: MonthlyRow[]; kpis: KPIs } {
  const rows: MonthlyRow[] = [];
  let capital = Number(port.importe_inicial) || 0;
  let rendAcum = 0;
  const pct = (Number(port.rendimiento_mensual_pct) || 0) / 100;
  const comPct = (Number(port.comision_retiro_pct) || 0) / 100;
  const aporteMensual = Number(port.aportacion_mensual || 0);

  const extras = (port.aportaciones_extra || []).map(x => ({ ...x, monto: Number(x.monto) }));
  const retiros = (port.retiros_capital || []).map(x => ({ ...x, monto: Number(x.monto) }));

  const start = new Date(port.fecha_inicio);
  const N = Number(port.plazo_meses) || 0;

  let rendBruto = 0;
  let comisiones = 0;
  const capitalInicialTotal = capital;

  for (let m = 0; m <= N; m++) {
    const fecha = addMonths(start, m);
    const iso = formatISO(fecha, { representation: "date" });

    const aportesExtraEsteMes = extras
      .filter(a => a.fecha.slice(0, 7) === iso.slice(0, 7))
      .reduce((s, a) => s + a.monto, 0);

    const retirosCapitalEsteMes = retiros
      .filter(r => r.fecha.slice(0, 7) === iso.slice(0, 7))
      .reduce((s, r) => s + r.monto, 0);

    // aportación mensual + extras at period start
    capital += aporteMensual + aportesExtraEsteMes;

    const rend = capital * pct;
    rendBruto += rend;
    rendAcum += rend;

    // scheduled withdrawal of returns
    let retiroRend = 0;
    if (port.retiro_rend_programado) {
      const isMensual = port.periodicidad_rend === "Mensual";
      const isTrimestral = port.periodicidad_rend === "Trimestral" && m > 0 && m % 3 === 0;
      if (isMensual || isTrimestral) {
        retiroRend = rend;
      }
    }

    const comision = retiroRend * comPct;
    comisiones += comision;

    // apply withdrawals of returns + commissions
    const totalRetiroRend = retiroRend + comision;
    capital = capital + rend - totalRetiroRend;

    // apply capital withdrawals
    capital = Math.max(0, capital - retirosCapitalEsteMes);

    rows.push({
      mes: m,
      fecha: iso,
      capital_inicial: Math.max(0, capital - rend + totalRetiroRend + retirosCapitalEsteMes - aporteMensual - aportesExtraEsteMes),
      aportacion_mensual: aporteMensual + aportesExtraEsteMes,
      rendimiento_mx: rend,
      rendimiento_acum: rendAcum,
      retiro_rend: retiroRend,
      comision_retiro: comision,
      retiro_capital: retirosCapitalEsteMes,
      capital_final: capital
    });
  }

  const kpis: KPIs = {
    capital_inicial_total: capitalInicialTotal,
    rend_bruto: rendBruto,
    comisiones,
    rend_neto: rendBruto - comisiones,
    capital_final: capital
  };

  return { rows, kpis };
}
