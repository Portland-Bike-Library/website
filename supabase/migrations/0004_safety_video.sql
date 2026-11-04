-- Borrowers confirm they watched the safety orientation video (/learn)
-- when submitting a reservation. Timestamp of that confirmation.
alter table public.reservations
  add column safety_video_confirmed_at timestamptz;
