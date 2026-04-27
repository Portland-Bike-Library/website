export interface MinorOnWaiver {
  name: string;
  dateOfBirth: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  hasSignedWaiver: boolean;
  waiverSignedAt?: Date;
  waiverPrintedName?: string;
  waiverSignature?: string;
  waiverMinor?: MinorOnWaiver;
  hasWatchedVideo: boolean;
  videoWatchedAt?: Date;
  createdAt: Date;
}

export interface WaiverSignature {
  userId: string;
  printedName: string;
  signature: string;
  signedAt: Date;
  minor?: MinorOnWaiver;
  ipAddress?: string;
  userAgent?: string;
}

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
