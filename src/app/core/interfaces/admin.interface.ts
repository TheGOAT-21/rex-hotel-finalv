export enum AdminRole {
    SUPER_ADMIN = 'super_admin',
    MANAGER = 'manager',
    RECEPTIONIST = 'receptionist',
    STAFF = 'staff'
  }
  
  export interface Admin {
    id: string;
    username: string;
    password?: string; // Ne jamais retourner au client
    name: string;
    email: string;
    role: AdminRole;
    lastLogin?: Date;
    active: boolean;
  }