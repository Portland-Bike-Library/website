export interface Bike {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  image: string;
  available: boolean;
  features: string[];
}

// Sample inventory - replace with real bikes as they're acquired
export const bikes: Bike[] = [
  {
    id: "bike-001",
    name: "Family Cruiser",
    type: "Adult Cruiser",
    size: "Adult (5'4\" - 6'0\")",
    description: "A comfortable cruiser bike perfect for neighborhood rides. Features an upright seating position and easy-to-use coaster brake.",
    image: "/bikes/cruiser.jpg",
    available: true,
    features: ["Coaster brake", "Basket included", "Kickstand", "Bell"]
  },
  {
    id: "bike-002",
    name: "Youth Explorer",
    type: "Youth Mountain Bike",
    size: "Youth (4'2\" - 4'10\")",
    description: "A durable youth bike with 20\" wheels, great for kids learning to ride independently.",
    image: "/bikes/youth.jpg",
    available: true,
    features: ["Hand brakes", "6-speed gears", "Adjustable seat", "Reflectors"]
  },
  {
    id: "bike-003",
    name: "Cargo Hauler",
    type: "Cargo Bike",
    size: "Adult (5'2\" - 6'2\")",
    description: "A front-loading cargo bike perfect for carrying kids or groceries. Electric-assist available.",
    image: "/bikes/cargo.jpg",
    available: false,
    features: ["Front cargo box", "Electric assist", "Hydraulic brakes", "Lights included"]
  },
  {
    id: "bike-004",
    name: "Starter Balance",
    type: "Balance Bike",
    size: "Toddler (2-5 years)",
    description: "Help your little one learn balance before pedaling. Lightweight and easy to handle.",
    image: "/bikes/balance.jpg",
    available: true,
    features: ["No pedals", "Adjustable seat", "Lightweight frame", "Soft grips"]
  },
  {
    id: "bike-005",
    name: "Commuter Classic",
    type: "Hybrid Bike",
    size: "Adult (5'6\" - 6'2\")",
    description: "A versatile hybrid bike suitable for commuting or recreational rides around the neighborhood.",
    image: "/bikes/hybrid.jpg",
    available: true,
    features: ["21-speed", "Fenders", "Rack compatible", "Puncture-resistant tires"]
  }
];

export const bikeTypes = [
  "All Types",
  "Adult Cruiser",
  "Youth Mountain Bike",
  "Cargo Bike",
  "Balance Bike",
  "Hybrid Bike"
];
