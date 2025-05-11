import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Space, SpaceType, RoomSpace, DiningSpace, EventSpace } from '../interfaces/space.interface';
import { NotificationService } from './notification.service';
import { LocalStorageService } from './local-storage.service';

// Import mock data
import {
  roomTypeA,
  roomTypeB,
  roomTypeC,
  roomTypeD,
  roomTypeP,
  mainRestaurant,
  terraceRDC,
  terraceFirstFloor,
  meetingRoom1,
  meetingRoom2,
  conferenceRoom,
  weddingHall,
  exteriorSpace,
  parkingRDC,
  swimmingPool,
  firstFloorHall,
  kidsArea,
  SPACES
} from '../../../mocks/spaces.mock';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private spaces: Space[] = SPACES;
  private spacesSubject = new BehaviorSubject<Space[]>(this.spaces);
  private readonly CACHE_KEY = 'spaces_cache';
  private readonly CACHE_DURATION = 3600; // 1 hour in seconds

  constructor(
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService
  ) {
    this.initializeData();
  }

  /**
   * Initialize data from cache or mock data
   */
  private initializeData(): void {
    const cachedData = this.localStorageService.get<Space[]>(this.CACHE_KEY);
    
    if (cachedData) {
      this.spaces = cachedData;
    } else {
      this.spaces = SPACES;
      // Cache the data
      this.localStorageService.set(this.CACHE_KEY, this.spaces, this.CACHE_DURATION);
    }
    
    this.spacesSubject.next(this.spaces);
  }

  /**
   * Get all spaces
   */
  getAllSpaces(): Observable<Space[]> {
    return this.spacesSubject.asObservable().pipe(
      delay(500), // Small delay to simulate network
      tap(spaces => {
        if (!spaces || spaces.length === 0) {
          console.warn('No spaces found');
        }
      })
    );
  }

  /**
   * Get a space by ID
   */
  getSpaceById(id: string): Observable<Space | undefined> {
    return this.spacesSubject.pipe(
      map(spaces => {
        const space = spaces.find(space => space.id === id);
        if (!space) {
          console.warn(`Space with id ${id} not found`);
        }
        return space;
      }),
      delay(500)
    );
  }

  /**
   * Get spaces by type
   */
  getSpacesByType(type: SpaceType): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => spaces.filter(space => space.type === type)),
      delay(500)
    );
  }

  /**
   * Get featured spaces
   */
  getFeaturedSpaces(limit: number = 3): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => {
        // Get a mix of different types of spaces
        const rooms = spaces.filter(space => space.type === SpaceType.ROOM).slice(0, 2);
        const others = spaces.filter(space => space.type !== SpaceType.ROOM).slice(0, 1);
        return [...rooms, ...others].slice(0, limit);
      }),
      delay(500)
    );
  }

  /**
   * Search spaces with filters
   */
  searchSpaces(filters: {
    type?: SpaceType;
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    available?: boolean;
    features?: string[];
  }): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => {
        let filtered = [...spaces];

        // Apply type filter
        if (filters.type) {
          filtered = filtered.filter(space => space.type === filters.type);
        }

        // Apply price filters
        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(space => 
            space.price ? space.price >= filters.minPrice! : true
          );
        }
        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(space => 
            space.price ? space.price <= filters.maxPrice! : true
          );
        }

        // Apply capacity filter
        if (filters.capacity !== undefined) {
          filtered = filtered.filter(space => 
            space.capacity ? space.capacity >= filters.capacity! : true
          );
        }

        // Apply availability filter
        if (filters.available !== undefined) {
          filtered = filtered.filter(space => space.available === filters.available);
        }

        // Apply features filter
        if (filters.features && filters.features.length > 0) {
          filtered = filtered.filter(space => 
            filters.features!.every(feature => 
              space.features.some(f => 
                f.name.toLowerCase().includes(feature.toLowerCase()) || 
                f.icon === feature
              )
            )
          );
        }

        return filtered;
      }),
      delay(500)
    );
  }

  /**
   * Check availability for a space
   */
  checkAvailability(spaceId: string, checkIn: Date, checkOut: Date): Observable<boolean> {
    return this.spacesSubject.pipe(
      map(spaces => {
        const space = spaces.find(s => s.id === spaceId);
        if (!space) {
          return false;
        }

        // For demo purposes, return true 90% of the time
        const isAvailable = Math.random() > 0.1;
        
        if (!isAvailable) {
          this.notificationService.showWarning(
            'Cet espace n\'est pas disponible aux dates sélectionnées.',
            'Non disponible'
          );
        }

        return isAvailable && space.available;
      }),
      delay(1000)
    );
  }

  /**
   * Get related spaces
   */
  getRelatedSpaces(spaceId: string, limit: number = 3): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => {
        const currentSpace = spaces.find(s => s.id === spaceId);
        if (!currentSpace) {
          return [];
        }

        return spaces
          .filter(s => 
            s.id !== spaceId && 
            s.type === currentSpace.type
          )
          .slice(0, limit);
      }),
      delay(500)
    );
  }

  /**
   * Get room spaces
   */
  getRoomSpaces(): Observable<RoomSpace[]> {
    return this.spacesSubject.pipe(
      map(spaces => 
        spaces.filter(space => 
          space.type === SpaceType.ROOM
        ) as RoomSpace[]
      ),
      delay(500)
    );
  }

  /**
   * Get dining spaces
   */
  getDiningSpaces(): Observable<DiningSpace[]> {
    return this.spacesSubject.pipe(
      map(spaces => 
        spaces.filter(space => 
          space.type === SpaceType.RESTAURANT || 
          space.type === SpaceType.BAR
        ) as DiningSpace[]
      ),
      delay(500)
    );
  }

  /**
   * Get event spaces
   */
  getEventSpaces(): Observable<EventSpace[]> {
    return this.spacesSubject.pipe(
      map(spaces => 
        spaces.filter(space => 
          space.type === SpaceType.EVENT_SPACE
        ) as EventSpace[]
      ),
      delay(500)
    );
  }

  /**
   * Update space availability
   */
  updateSpaceAvailability(spaceId: string, available: boolean): Observable<boolean> {
    const spaceIndex = this.spaces.findIndex(s => s.id === spaceId);
    if (spaceIndex === -1) {
      return of(false);
    }

    this.spaces[spaceIndex] = {
      ...this.spaces[spaceIndex],
      available
    };

    this.spacesSubject.next(this.spaces);
    this.localStorageService.set(this.CACHE_KEY, this.spaces, this.CACHE_DURATION);

    return of(true).pipe(delay(500));
  }

  /**
   * Get available space count by type
   */
  getAvailableSpaceCount(type: SpaceType): Observable<number> {
    return this.spacesSubject.pipe(
      map(spaces => 
        spaces.filter(space => 
          space.type === type && 
          space.available
        ).length
      )
    );
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.localStorageService.remove(this.CACHE_KEY);
    this.initializeData();
  }

  /**
   * Refresh data
   */
  refresh(): void {
    this.clearCache();
    this.initializeData();
    this.notificationService.showSuccess('Données actualisées avec succès');
  }
}