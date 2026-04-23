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

export interface BikeCheckout {
  id: string;
  bikeId: string;
  userId: string;
  checkoutDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
}
