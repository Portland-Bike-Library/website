export interface Bike {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  image: string;
  available: boolean;
  features: string[];
  maxLoanPeriod: string;
}

export const bikes: Bike[] = [
  {
    id: "xtracycle-rfa",
    name: "Xtracycle RFA",
    type: "Cargo E-Bike",
    size: "Adult (5'3\" - 6'3\")",
    description: "A versatile cargo e-bike with step-through frame, perfect for hauling kids on the back. Class III pedal-assist with a top speed of 20 mph and 30-60 mile battery range.",
    image: "/bikes/xtracycle-rfa.jpg",
    available: true,
    maxLoanPeriod: "2 weeks",
    features: [
      "Class III pedal assist (20 mph)",
      "30-60 mile battery range",
      "Step-through frame",
      "Hydraulic disc brakes",
      "Integrated front & rear lights",
      "Hooptie rear safety rails",
      "Cushioned rear seating",
      "Front rack with porter-pack bag",
      "Center kickstand",
      "Front & rear fenders"
    ]
  },
  {
    id: "woom-now-6",
    name: "Woom Now 6",
    type: "Kids Bike",
    size: "Kids (26\" rear / 20\" front)",
    description: "A premium kids bike with innovative mixed wheel sizes for stable handling and an upright riding position. Features a frame-mounted front rack perfect for school bags.",
    image: "/bikes/woom-now-6.jpg",
    available: true,
    maxLoanPeriod: "1 month",
    features: [
      "8-speed gears",
      "Lightweight aluminum frame",
      "Dynamo-powered LED lights",
      "Front rack (22 lb capacity)",
      "Wide fenders",
      "Twist-grip bell",
      "Anti-slip pedals",
      "Aluminum kickstand",
      "Standlight function when stopped"
    ]
  }
];

export const bikeTypes = [
  "All Types",
  "Cargo E-Bike",
  "Kids Bike"
];
