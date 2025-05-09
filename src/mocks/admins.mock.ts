import { Admin, AdminRole } from '../app/core/interfaces/admin.interface';
import { v4 as uuidv4 } from 'uuid';

export const ADMINS: Admin[] = [
  {
    id: uuidv4(),
    username: 'admin',
    password: 'hashed_password_here', // Dans une application réelle, ce serait un hash, pas un mot de passe en clair
    name: 'Administrateur Principal',
    email: 'admin@rexhotel.com',
    role: AdminRole.SUPER_ADMIN,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
    active: true
  },
  {
    id: uuidv4(),
    username: 'manager',
    password: 'hashed_password_here',
    name: 'Directeur Hôtel',
    email: 'manager@rexhotel.com',
    role: AdminRole.MANAGER,
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
    active: true
  },
  {
    id: uuidv4(),
    username: 'reception1',
    password: 'hashed_password_here',
    name: 'Réceptionniste 1',
    email: 'reception1@rexhotel.com',
    role: AdminRole.RECEPTIONIST,
    lastLogin: new Date(),
    active: true
  },
  {
    id: uuidv4(),
    username: 'reception2',
    password: 'hashed_password_here',
    name: 'Réceptionniste 2',
    email: 'reception2@rexhotel.com',
    role: AdminRole.RECEPTIONIST,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000), // Il y a 1 heure
    active: true
  },
  {
    id: uuidv4(),
    username: 'staff1',
    password: 'hashed_password_here',
    name: 'Personnel 1',
    email: 'staff1@rexhotel.com',
    role: AdminRole.STAFF,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
    active: true
  },
  {
    id: uuidv4(),
    username: 'staff2',
    password: 'hashed_password_here',
    name: 'Personnel 2',
    email: 'staff2@rexhotel.com',
    role: AdminRole.STAFF,
    lastLogin: undefined, // Jamais connecté
    active: false
  }
];