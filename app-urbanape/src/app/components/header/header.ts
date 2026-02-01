import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { User } from '../../services/api.types';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html'
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showUserInfo: boolean = false;
  @Input() showNewUserButton: boolean = false;
  @Input() showBackButton: boolean = false;
  @Input() showMenuButton: boolean = false;
  @Input() currentUser: User | null = null;

  @Output() logout = new EventEmitter<void>();
  @Output() goToRegister = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();

  isUserMenuOpen = false;

  onLogout(): void {
    this.isUserMenuOpen = false;
    this.logout.emit();
  }

  onGoToRegister(): void {
    this.goToRegister.emit();
  }

  onGoBack(): void {
    this.goBack.emit();
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
