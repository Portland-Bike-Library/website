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
- In-memory data store (development mode)

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # AuthProvider, Navigation, Footer
├── lib/           # Auth logic, types, store, rate limiting
└── content/       # Static content (waiver, inventory, org info)
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

Bike data is in `src/content/inventory.ts`. Photos go in `public/bikes/` and should match the `image` path in the bike object.

## Key Requirements

- Click-to-accept Terms of Service and Acceptance of Risk waiver
- Helmet requirement emphasized in safety education
- Track bike usage and maintenance
- Low/no-cost fee structure for borrowers
