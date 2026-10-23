# Portland Bike Library

A community bike-sharing website for a 501(c)(3) nonprofit serving inner SE Portland.

## Mission

To promote safe, fun, active transportation for families in inner SE Portland, centered around the Abernethy Elementary School catchment area. We primarily achieve this by providing access to bikes via a lending library.

**Vision:** A community where every family has the opportunity to walk, bike, roll around their neighborhood safely and enjoyably.

## Organization

- **Board:** Aaron Stoertz, Jake Milligan, Quinn Keogh
- **Service Area:** Abernethy Elementary School catchment area, inner SE Portland
- **Goal:** 5 high-quality bikes in circulation by end of 2025

## Tech Stack

- Next.js 16 with App Router (React 19)
- TypeScript
- Tailwind CSS 4
- Supabase (Postgres + Storage) for reservations and bike inventory

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # AuthProvider, Navigation, Footer
├── lib/           # Admin auth, Supabase client, bike data access, types
└── content/       # Static content (waiver, org info)
public/
└── bikes/         # Bike photos
```

## User Flow

Users must complete: Sign up → Sign waiver → Watch safety video → Access bikes

All participants must sign a liability waiver with Terms of Service and Acceptance of Risk before borrowing bikes.

## Development

```bash
npm run dev    # Start dev server at localhost:3000
```

## Inventory

Bikes live in the Supabase `bikes` table and are edited by admins at `/admin/bikes` (add, edit, delete, toggle availability, upload photo). Photos upload to the public `bike-photos` storage bucket; the original seed photos remain in `public/bikes/`. Schema is in `supabase/migrations/`.

## Key Requirements

- Click-to-accept Terms of Service and Acceptance of Risk waiver
- Helmet requirement emphasized in safety education
- Track bike usage and maintenance
- Low/no-cost fee structure for borrowers
