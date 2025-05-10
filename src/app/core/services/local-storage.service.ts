// src/app/core/services/local-storage.service.ts

import { Injectable } from '@angular/core';

export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry?: number; // Durée de validité en secondes
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix = 'rex_hotel_';

  constructor() {
    this.cleanExpiredItems();
  }

  /**
   * Enregistre une valeur dans le localStorage
   * @param key Clé de stockage
   * @param value Valeur à stocker
   * @param expiry Durée de validité en secondes (optionnel)
   */
  set<T>(key: string, value: T, expiry?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry
      };

      localStorage.setItem(
        this.getKeyWithPrefix(key),
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Erreur lors du stockage :', error);
      this.handleStorageError(error);
    }
  }

  /**
   * Récupère une valeur du localStorage
   * @param key Clé de stockage
   * @param defaultValue Valeur par défaut si non trouvée
   * @returns La valeur stockée ou la valeur par défaut
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(this.getKeyWithPrefix(key));
      
      if (!item) {
        return defaultValue;
      }

      const storedItem: StorageItem<T> = JSON.parse(item);

      // Vérifier si l'item a expiré
      if (this.isExpired(storedItem)) {
        this.remove(key);
        return defaultValue;
      }

      return storedItem.value;
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      return defaultValue;
    }
  }

  /**
   * Supprime une valeur du localStorage
   * @param key Clé de stockage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKeyWithPrefix(key));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  }

  /**
   * Vérifie si une clé existe dans le localStorage
   * @param key Clé de stockage
   * @returns boolean
   */
  has(key: string): boolean {
    return localStorage.getItem(this.getKeyWithPrefix(key)) !== null;
  }

  /**
   * Vide le localStorage (uniquement les éléments avec le préfixe de l'application)
   */
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Erreur lors du nettoyage :', error);
    }
  }

  /**
   * Récupère toutes les clés du localStorage (avec le préfixe de l'application)
   * @returns Array de clés
   */
  getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  /**
   * Récupère la taille totale utilisée en bytes
   * @returns nombre de bytes utilisés
   */
  getTotalSize(): number {
    let total = 0;
    for (const key of this.getAllKeys()) {
      const item = localStorage.getItem(this.getKeyWithPrefix(key));
      if (item) {
        total += (key.length + item.length) * 2; // Unicode uses 2 bytes per character
      }
    }
    return total;
  }

  /**
   * Enregistre plusieurs valeurs en une fois
   * @param items Objet contenant les paires clé-valeur à stocker
   * @param expiry Durée de validité en secondes (optionnel)
   */
  setMultiple(items: { [key: string]: any }, expiry?: number): void {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value, expiry);
    });
  }

  /**
   * Récupère plusieurs valeurs en une fois
   * @param keys Tableau de clés à récupérer
   * @returns Objet contenant les paires clé-valeur
   */
  getMultiple(keys: string[]): { [key: string]: any } {
    return keys.reduce((acc, key) => {
      acc[key] = this.get(key);
      return acc;
    }, {} as { [key: string]: any });
  }

  /**
   * Sauvegarde un objet avec vérification de version
   * @param key Clé de stockage
   * @param value Valeur à stocker
   * @param version Version de la donnée
   * @param expiry Durée de validité en secondes (optionnel)
   */
  setWithVersion<T>(key: string, value: T, version: number, expiry?: number): void {
    const versionedValue = {
      data: value,
      version
    };
    this.set(key, versionedValue, expiry);
  }

  /**
   * Récupère un objet avec vérification de version
   * @param key Clé de stockage
   * @param currentVersion Version actuelle attendue
   * @returns La valeur si la version correspond, undefined sinon
   */
  getWithVersion<T>(key: string, currentVersion: number): T | undefined {
    const item = this.get<{ data: T; version: number }>(key);
    if (item && item.version === currentVersion) {
      return item.data;
    }
    this.remove(key);
    return undefined;
  }

  /**
   * Sauvegarde les préférences utilisateur
   * @param preferences Objet contenant les préférences
   */
  saveUserPreferences(preferences: any): void {
    this.set('user_preferences', preferences);
  }

  /**
   * Récupère les préférences utilisateur
   * @returns Les préférences utilisateur ou un objet vide
   */
  getUserPreferences(): any {
    return this.get('user_preferences', {});
  }

  /**
   * Sauvegarde l'état temporaire d'un formulaire
   * @param formId Identifiant du formulaire
   * @param formData Données du formulaire
   */
  saveFormState(formId: string, formData: any): void {
    this.set(`form_${formId}`, formData, 3600); // expire après 1 heure
  }

  /**
   * Récupère l'état temporaire d'un formulaire
   * @param formId Identifiant du formulaire
   * @returns Les données du formulaire ou undefined
   */
  getFormState(formId: string): any {
    return this.get(`form_${formId}`);
  }

  /**
   * Nettoie les éléments expirés du localStorage
   */
  private cleanExpiredItems(): void {
    this.getAllKeys().forEach(key => {
      const item = localStorage.getItem(this.getKeyWithPrefix(key));
      if (item) {
        const storedItem: StorageItem<any> = JSON.parse(item);
        if (this.isExpired(storedItem)) {
          this.remove(key);
        }
      }
    });
  }

  /**
   * Vérifie si un élément a expiré
   * @param item Élément à vérifier
   * @returns boolean
   */
  private isExpired(item: StorageItem<any>): boolean {
    if (!item.expiry) return false;
    const now = Date.now();
    return now - item.timestamp > item.expiry * 1000;
  }

  /**
   * Ajoute le préfixe à la clé
   * @param key Clé de stockage
   * @returns Clé avec préfixe
   */
  private getKeyWithPrefix(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Gère les erreurs de stockage
   * @param error Erreur à gérer
   */
  private handleStorageError(error: any): void {
    if (error.name === 'QuotaExceededError') {
      // Le stockage est plein, on nettoie les éléments expirés
      this.cleanExpiredItems();
    }
    // Autres types d'erreurs...
  }
}