export interface User {
  id: string;
  email: string;
  name: string;
  hasSignedWaiver: boolean;
  waiverSignedAt?: Date;
  waiverSignature?: string;
  hasWatchedVideo: boolean;
  videoWatchedAt?: Date;
  createdAt: Date;
}

export interface WaiverSignature {
  userId: string;
  signature: string;
  signedAt: Date;
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
