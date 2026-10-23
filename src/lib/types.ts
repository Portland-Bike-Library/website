export type ReservationStatus =
  | "pending"
  | "approved"
  | "denied"
  | "picked_up"
  | "returned"
  | "cancelled";

export interface Reservation {
  id: string;
  borrower_name: string;
  borrower_email: string;
  borrower_phone: string | null;
  bike_id: string;
  bike_name: string;
  start_date: string;
  end_date: string;
  minor_name: string | null;
  minor_dob: string | null;
  waiver_printed_name: string;
  waiver_signature: string;
  waiver_signed_at: string;
  waiver_ip: string | null;
  waiver_user_agent: string | null;
  status: ReservationStatus;
  admin_notes: string | null;
  created_at: string;
  approved_at: string | null;
  picked_up_at: string | null;
  returned_at: string | null;
  admin_notified_at: string | null;
}

// Row shape of public.bikes
export interface BikeRow {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  image_url: string;
  available: boolean;
  max_loan_period: string;
  features: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// App-facing bike shape (used by inventory, reserve form, admin)
export interface Bike {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  image: string;
  available: boolean;
  maxLoanPeriod: string;
  features: string[];
  sortOrder: number;
}

// Fields an admin can set when creating/updating a bike
export interface BikeInput {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
  image: string;
  available: boolean;
  maxLoanPeriod: string;
  features: string[];
  sortOrder: number;
}
