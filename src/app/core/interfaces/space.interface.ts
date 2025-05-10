export enum SpaceType {
    ROOM = 'room',
    RESTAURANT = 'restaurant',
    BAR = 'bar',
    EVENT_SPACE = 'event_space'
  }
  
  export interface Image {
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
    caption?: string;
  }
  
  export interface Feature {
    name: string;
    description?: string;
    icon?: string;
  }
  
  export interface MenuItem {
    name: string;
    description?: string;
    price: number;
    category?: string;
    available: boolean;
  }
  
  export interface TimeRange {
    open: string; // Format: "HH:MM"
    close: string; // Format: "HH:MM"
  }
  
  export interface OpeningHours {
    monday?: TimeRange;
    tuesday?: TimeRange;
    wednesday?: TimeRange;
    thursday?: TimeRange;
    friday?: TimeRange;
    saturday?: TimeRange;
    sunday?: TimeRange;
  }
  
  export interface Layout {
    name: string;
    capacity: number;
    description?: string;
    image?: string;
  }
  
  export interface Space {
    id: string;
    name: string;
    type: SpaceType;
    description: string;
    images: Image[];
    features: Feature[];
    capacity?: number;
    price?: number;
    currency?: string;
    priceUnit?: string;
    available: boolean;
  }
  
  export interface RoomSpace extends Space {
    bedType: string;
    size: number; // en m²
    view: string;
    amenities: string[];
  }
  
  export interface DiningSpace extends Space {
    cuisine?: string;
    menuItems: MenuItem[];
    openingHours: OpeningHours;
  }
  
  export interface EventSpace extends Space {
    size: number; // en m²
    pricePerDay: number;
    layouts: Layout[];
  }