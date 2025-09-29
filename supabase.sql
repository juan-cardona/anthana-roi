-- Run this in Supabase SQL editor. Keep RLS OFF for these tables.
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  telefono text,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  nombre text not null,
  tipo_portafolio text check (tipo_portafolio in ('Conservador','Moderado','Agresivo')) default 'Conservador',
  moneda text default 'MXN',
  importe_inicial numeric(14,2) not null default 0,
  rendimiento_mensual_pct numeric(7,4) not null default 0,
  plazo_meses int not null default 6,
  fecha_inicio date not null,
  comision_retiro_pct numeric(7,4) not null default 0,
  retiro_rend_programado boolean not null default false,
  periodicidad_rend text check (periodicidad_rend in ('Mensual','Trimestral')) default 'Mensual',
  aportacion_mensual numeric(14,2),
  aportaciones_extra jsonb,
  retiros_capital jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_portfolios_client on portfolios(client_id);
