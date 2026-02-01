import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/ApiService';
import type { User } from '../../services/api.types';
import { HeaderComponent } from '../../components/header/header';
import { BreadcrumbComponent, type BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';
import { MenuComponent, type MenuItem } from '../../components/menu/menu';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, HeaderComponent, BreadcrumbComponent, MenuComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  currentUser: User | null = null;
  breadcrumbItems: BreadcrumbItem[] = [];
  isMenuOpen = false;
  menuItems: MenuItem[] = [];
  isAdmin = true;
  pageTitle = '';

  ngOnInit(): void {
    this.loadUser();
    this.setupBreadcrumb();
  }

  getMenuItems(): MenuItem[] {
    if (this.isAdmin) {
      return [
        { label: 'Dashboard', route: '/admin/dashboard', icon: 'home' },
        { label: 'Usuários', route: '/admin/users', icon: 'users' },
        { label: 'Cartões', route: '/admin/cards', icon: 'cards' },
        { label: 'Minha Conta', route: '/admin/myaccount', icon: 'settings' },
        { label: 'Meus Cartões', route: '/admin/mycards', icon: 'cards' },
      ];
    } else {
      return [
        { label: 'Minha Conta', route: '/myaccount', icon: 'settings' },
        { label: 'Meus Cartões', route: '/mycards', icon: 'cards' },
      ];
    }
  }

  getPageTitle(): string {
    return this.isAdmin ? 'Painel Administrativo' : 'Minha Conta';
  }

  setupBreadcrumb(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
        this.checkRouteAccess();
      });
    this.updateBreadcrumb();
  }

  checkRouteAccess(): void {
    if (!this.isAdmin && this.currentUser) {
      const url = this.router.url;
      const allowedRoutes = ['/myaccount', '/mycards'];
      const isAllowed = allowedRoutes.some(route => url === route || url.startsWith(route + '/'));
      
      if (!isAllowed) {
        this.router.navigate(['/myaccount']);
      }
    }
  }

  updateBreadcrumb(): void {
    const url = this.router.url;
    const items: BreadcrumbItem[] = [];

    if (this.isAdmin) {
      items.push({ label: 'Administrativo', route: '/admin/dashboard' });
    } else {
      items.push({ label: 'Minha Conta', route: '/myaccount' });
    }

    if (url.includes('/admin/dashboard') || (url === '/admin' && this.isAdmin)) {
      items.push({ label: 'Dashboard' });
    } else if (url.includes('/admin/register')) {
      items.push({ label: 'Usuários', route: '/admin/users' });
      items.push({ label: 'Novo' });
    } else if (url.includes('/admin/users/edit')) {
      items.push({ label: 'Usuários', route: '/admin/users' });
      items.push({ label: 'Editar' });
    } else if (url.includes('/admin/users')) {
      items.push({ label: 'Usuários' });
    } else if (url.includes('/admin/cards')) {
      items.push({ label: 'Cartões' });
    } else if (url.includes('/myaccount') || url === '/myaccount') {
      if (!this.isAdmin) {
        items.length = 0;
        items.push({ label: 'Minha Conta' });
      } else {
        items.push({ label: 'Minha Conta' });
      }
    } else if (url.includes('/mycards') || url === '/mycards') {
      if (!this.isAdmin) {
        items.length = 0;
        items.push({ label: 'Meus Cartões' });
      } else {
        items.push({ label: 'Meus Cartões' });
      }
    } else if (url.includes('/admin/mycards')) {
      items.push({ label: 'Meus Cartões' });
    }

    this.breadcrumbItems = items;
  }

  loadUser(): void {  
    this.apiService.getMe().pipe(catchError(() => of(null))).subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.isAdmin = user.role == 'ADMIN';
          this.menuItems = this.getMenuItems();
          this.pageTitle = this.getPageTitle();
          this.checkRouteAccess();
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.apiService.clearToken();
    this.router.navigate(['/login']);
  }
}
