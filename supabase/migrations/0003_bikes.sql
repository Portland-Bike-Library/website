-- Portland Bike Library — bikes table + photo bucket
-- Moves the inventory out of src/content/inventory.ts so admins can edit it
-- at /admin/bikes. RLS on with no policies: service role only (same as
-- reservations). reservations.bike_id references bikes.id by convention
-- (no FK) so deleting a bike never loses reservation history — bike_name
-- is denormalized onto each reservation.

create table public.bikes (
  id text primary key
    check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  type text not null,
  size text not null default '',
  description text not null default '',
  image_url text not null default '',
  available boolean not null default true,
  max_loan_period text not null default '2 weeks',
  features text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bikes_sort_order_idx on public.bikes (sort_order, created_at);

alter table public.bikes enable row level security;
grant select, insert, update, delete on public.bikes to service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bikes_set_updated_at
  before update on public.bikes
  for each row execute function public.set_updated_at();

-- Public bucket for bike photos; uploads go through the server (service role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bike-photos', 'bike-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Seed with the previously hardcoded inventory (photos stay in public/bikes/).
insert into public.bikes (id, name, type, size, description, image_url, available, max_loan_period, features, sort_order) values
(
  'xtracycle-rfa', 'Xtracycle RFA', 'Cargo E-Bike', 'Adult (5''3" - 6''3")',
  'A versatile cargo e-bike with step-through frame, perfect for hauling kids on the back. Class III pedal-assist with a top speed of 20 mph and 30-60 mile battery range.',
  '/bikes/xtracycle-rfa.jpg', true, '2 weeks',
  array['Class III pedal assist (20 mph)', '30-60 mile battery range', 'Step-through frame', 'Hydraulic disc brakes', 'Integrated front & rear lights', 'Hooptie rear safety rails', 'Cushioned rear seating', 'Front rack with porter-pack bag', 'Center kickstand', 'Front & rear fenders'],
  0
),
(
  'woom-now-6', 'Woom Now 6', 'Kids Bike', 'Kids (26" rear / 20" front)',
  'A premium kids bike with innovative mixed wheel sizes for stable handling and an upright riding position. Features a frame-mounted front rack perfect for school bags.',
  '/bikes/woom-now-6.jpg', true, '1 month',
  array['8-speed gears', 'Lightweight aluminum frame', 'Dynamo-powered LED lights', 'Front rack (22 lb capacity)', 'Wide fenders', 'Twist-grip bell', 'Anti-slip pedals', 'Aluminum kickstand', 'Standlight function when stopped'],
  1
),
(
  'vvolt-slice-lite', 'Vvolt Slice Lite', 'Utility E-Bike', 'Adult (adjustable, step-through frame)',
  'A lightweight utility e-bike with mixed wheel sizes for better cargo handling. Class II pedal-assist with throttle, Gates belt drive, and front cargo module.',
  '/bikes/vvolt-slice-lite.webp', true, '2 weeks',
  array['Class II pedal assist (20 mph)', '350W motor with 500Wh battery', '20-55 mile range', 'Gates belt drive (no chain)', 'Hydraulic disc brakes', 'Step-through frame (52 lbs)', 'Front cargo module (40 lb capacity)', 'Torque, cadence & speed sensors', 'Integrated front & rear lights', 'Mixed wheels (20" front / 26" rear)'],
  2
);
