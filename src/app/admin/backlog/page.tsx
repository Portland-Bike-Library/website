import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";

type Item = {
  title: string;
  note: string;
  examples: { label: string; href: string }[];
};

const backlog: Item[] = [
  {
    title: "FAQ page",
    note: "Requirements, how a loan works, mechanical issues, child seats/accessories, theft prevention, cancel/rebook, other local rental options, contact.",
    examples: [
      { label: "MN Cargo Bike Library FAQ", href: "https://mcbl.bike/faqs/" },
      { label: "Forth E-Cargo Bike Library FAQ", href: "https://forthmobility.org/e-cargo-bike-library" },
    ],
  },
  {
    title: "Eligibility rules on reserve/bikes page",
    note: "18+, live in service area, secure place to lock bike, return on time w/ all accessories.",
    examples: [
      { label: "MN orientation page", href: "https://mcbl.bike/orientation/" },
      { label: "Charlottesville homepage (eligibility section)", href: "https://ebikelibrarycville.org/" },
    ],
  },
  {
    title: "In-person orientation before first loan",
    note: "Short required session: safety, locking, battery, waiver. Gate booking behind it.",
    examples: [
      { label: "MN orientation", href: "https://mcbl.bike/orientation/" },
      { label: "BikeMN Rochester launch (class → book → ride → return)", href: "https://www.bikemn.org/coming-to-a-fire-station-near-you-the-cargo-bike-library-rolls-into-rochester/" },
    ],
  },
  {
    title: "Fixed check-out / check-in windows",
    note: "e.g. check out Wed 6pm, check in Mon 6pm at Abernethy. Replaces ad-hoc scheduling.",
    examples: [
      { label: "MN Rochester branch page", href: "https://mcbl.bike/branches/rochester/" },
      { label: "Forth (Mondays 2–4pm at Cherry Park Elementary)", href: "https://forthmobility.org/e-cargo-bike-library" },
    ],
  },
  {
    title: "Safety content on /learn (replace placeholder video)",
    note: "Helmet, visibility, dooring/right hooks, practice first, brake check, charging, paved surfaces only.",
    examples: [
      { label: "Charlottesville safety page", href: "https://ebikelibrarycville.org/safety/" },
      { label: "Forth riding tips", href: "https://forthmobility.org/e-cargo-bike-library" },
    ],
  },
  {
    title: "Richer bike pages",
    note: "Rider height range, payload, # child passengers, range, class/top speed, who donated it.",
    examples: [
      { label: "MN bike page (Xtracycle Swoop)", href: "https://mcbl.bike/product/xtracycle-swoop-brackett-park-location/" },
      { label: "Charlottesville Our Bikes", href: "https://ebikelibrarycville.org/our-bikes/" },
    ],
  },
  {
    title: "Donate link + partner/donor recognition",
    note: "Optional donation (Every.org/Zeffy are free for nonprofits). Credit shops/brands on each bike.",
    examples: [
      { label: "Charlottesville Support", href: "https://ebikelibrarycville.org/support/" },
      { label: "MN Donate + partner list", href: "https://mcbl.bike/donate/" },
      { label: "Community Pedal Power Donate", href: "https://communitypedalpower.org/" },
    ],
  },
  {
    title: "Newsletter signup",
    note: "Doubles as waitlist when bikes are full. Resend audiences already available.",
    examples: [
      { label: "MN (used as 2027 waitlist)", href: "https://mcbl.bike/orientation/" },
      { label: "Community Pedal Power", href: "https://communitypedalpower.org/" },
    ],
  },
  {
    title: "Updates / news page + social links",
    note: "Short posts, stats (loans, miles), stolen-bike alerts, fundraisers.",
    examples: [
      { label: "MN Updates", href: "https://mcbl.bike/updates/" },
      { label: "Streets.mn one-month check-in", href: "https://streets.mn/2025/05/15/minneapolis-cargo-bike-library-one-month-check-in/" },
    ],
  },
  {
    title: "Buying guides / 'get your own' page",
    note: "Help borrowers who decide to buy; list rebates, local shops, discount codes.",
    examples: [
      { label: "Charlottesville Get Your E-bike", href: "https://ebikelibrarycville.org/get-yours/" },
      { label: "Community Pedal Power Guides", href: "https://communitypedalpower.org/" },
    ],
  },
  {
    title: "Events / family rides",
    note: "Group rides and cargo bike test-ride events as a recruiting funnel.",
    examples: [
      { label: "Community Pedal Power Events", href: "https://communitypedalpower.org/" },
      { label: "Charlottesville Events", href: "https://ebikelibrarycville.org/events/" },
    ],
  },
];

export default async function AdminBacklogPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/admin" className="text-green-700 text-sm hover:underline">
          &larr; Reservations
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-2">Site backlog</h1>
        <p className="text-sm text-gray-600 mb-8">
          Ideas from other bike libraries, with examples of who does each well.
        </p>
        <ol className="space-y-3 list-decimal list-inside">
          {backlog.map((item) => (
            <li key={item.title} className="bg-white rounded-lg shadow-md p-4">
              <span className="text-lg font-semibold text-gray-800">{item.title}</span>
              <p className="text-sm text-gray-600 mt-1">{item.note}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {item.examples.map((ex) => (
                  <li key={ex.href}>
                    <a
                      href={ex.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 text-sm hover:underline"
                    >
                      {ex.label} &nearr;
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
