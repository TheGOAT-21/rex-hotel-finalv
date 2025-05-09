// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { NavigationComponent } from './shared/components/layout/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NavigationComponent],
  template: `
    <div class="min-h-screen bg-background flex flex-col">
      <app-navigation [navItems]="navItems"></app-navigation>
      
      <main class="grow">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'REX Hotel';
  
  navItems = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/spaces', label: 'Espaces' },
    { path: '/booking', label: 'Réservation' },
    { path: '/contact', label: 'Contact' }
  ];
}