-- Grant the service_role full access to reservations.
-- (Needed because the project was created with "Automatically expose new
-- tables and functions" disabled, so default API-role grants were skipped.)
grant select, insert, update, delete on public.reservations to service_role;
