export interface DashboardStats {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    revenue: number;
    recentBookings: number;
    occupancyRate: number;
  }
  
  export interface RecentBooking {
    id: string;
    guestName: string;
    spaceType: string;
    spaceName: string;
    checkIn: Date;
    checkOut: Date;
    status: string;
    totalPrice: number;
  }
  
  export interface OccupancyData {
    date: Date;
    occupancyRate: number;
    totalRooms: number;
    occupiedRooms: number;
  }
  
  export interface RevenueData {
    period: string; // jour, semaine, mois ou année
    date: Date;
    amount: number;
    bookingsCount: number;
  }