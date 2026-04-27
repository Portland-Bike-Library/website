-- Portland Bike Library — initial schema
-- One denormalized table: each row is a reservation request that includes
-- the borrower's contact info, requested bike + dates, an inline waiver
-- signing, and an optional minor block. RLS is on with no policies, so
-- only the service role (server-side) can read/write.

create table public.reservations (
  id uuid primary key default gen_random_uuid(),

  -- Borrower (the adult; always the legally responsible party)
  borrower_name text not null,
  borrower_email text not null,
  borrower_phone text,

  -- Requested bike + dates
  -- bike_id matches an id from src/content/inventory.ts (kept in code, not DB)
  bike_id text not null,
  bike_name text not null,
  start_date date not null,
  end_date date not null,

  -- Optional minor (rider is the minor when these are set)
  minor_name text,
  minor_dob date,

  -- Inline waiver signing
  waiver_printed_name text not null,
  waiver_signature text not null,
  waiver_signed_at timestamptz not null default now(),
  waiver_ip text,
  waiver_user_agent text,

  -- Lifecycle
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied', 'picked_up', 'returned', 'cancelled')),
  admin_notes text,

  -- Timestamps
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  picked_up_at timestamptz,
  returned_at timestamptz,
  admin_notified_at timestamptz,

  constraint reservations_dates_ordered check (end_date >= start_date)
);

create index reservations_status_idx on public.reservations (status);
create index reservations_bike_id_idx on public.reservations (bike_id);
create index reservations_created_at_idx on public.reservations (created_at desc);

-- RLS on, no policies = denied for everyone except service_role (which bypasses).
alter table public.reservations enable row level security;
