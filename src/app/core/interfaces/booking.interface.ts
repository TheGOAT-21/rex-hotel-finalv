import { SpaceType } from './space.interface';

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  address?: string;
  postalCode?: string;
  city?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export interface Booking {
  id: string;
  guestInfo: GuestInfo;
  spaceId: string;
  spaceType: SpaceType;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: Date;
  confirmationCode?: string;
}