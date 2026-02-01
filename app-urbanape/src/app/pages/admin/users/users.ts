import { Component, inject, OnInit, HostListener, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/ApiService';
import type { User, DeleteUsersRequest } from '../../../services/api.types';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit, AfterViewChecked {
  private apiService = inject(ApiService);
  private router = inject(Router);

  users: User[] = [];
  isLoading = true;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;
  searchQuery = '';
  openDropdownId: number | null = null;
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalDanger = false;
  userToDelete: number | null = null;
  
  dropdownPositions: Map<number, { top: number; right: number }> = new Map();

  ngOnInit(): void {
    this.loadUsers(0);
  }

  loadUsers(page: number, search?: string): void {
    this.isLoading = true;
    this.currentPage = page;

    const params: any = { page, size: this.pageSize, sort: 'id,asc' };
    if (search !== undefined) {
      params.search = search.trim() || undefined;
    } else if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }

    this.apiService.listAllUsers(params).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadUsers(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrador' : 'Usuário';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToRegister(): void {
    this.router.navigate(['/admin/register']);
  }

  onSearch(): void {
    this.loadUsers(0);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadUsers(0);
  }

  toggleDropdown(userId: number, event?: Event): void {
    const wasOpen = this.openDropdownId === userId;
    this.openDropdownId = wasOpen ? null : userId;
    
    if (!wasOpen && event) {
      setTimeout(() => {
        this.updateDropdownPosition(userId, event.target as HTMLElement);
      }, 0);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onScrollOrResize(): void {
    if (this.openDropdownId !== null) {
      const button = document.querySelector(`[data-user-dropdown-button="${this.openDropdownId}"]`) as HTMLElement;
      if (button) {
        this.updateDropdownPosition(this.openDropdownId, button);
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.openDropdownId !== null) {
      const button = document.querySelector(`[data-user-dropdown-button="${this.openDropdownId}"]`) as HTMLElement;
      if (button && !this.dropdownPositions.has(this.openDropdownId)) {
        this.updateDropdownPosition(this.openDropdownId, button);
      }
    }
  }

  updateDropdownPosition(userId: number, buttonElement: HTMLElement): void {
    if (!buttonElement) return;
    
    const rect = buttonElement.getBoundingClientRect();
    this.dropdownPositions.set(userId, {
      top: rect.bottom + 8, // 8px = mt-2 (0.5rem)
      right: window.innerWidth - rect.right
    });
  }

  getDropdownPosition(userId: number): { top: number; right: number } {
    return this.dropdownPositions.get(userId) || { top: 0, right: 0 };
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  editUser(userId: number): void {
    this.closeDropdown();
    this.router.navigate(['/admin/users/edit', userId]);
  }

  removeUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    this.closeDropdown();
    this.userToDelete = userId;
    this.confirmModalTitle = 'Remover Usuário';
    this.confirmModalMessage = `Tem certeza que deseja remover o usuário "${user.name}" (${user.email})? Esta ação não pode ser desfeita e também removerá todos os cartões associados a este usuário.`;
    this.confirmModalDanger = true;
    this.showConfirmModal = true;
  }

  onConfirmRemoveUser(): void {
    if (this.userToDelete !== null) {
      this.deleteUser(this.userToDelete);
    }
    this.showConfirmModal = false;
    this.userToDelete = null;
  }

  onCancelConfirmModal(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      const request: DeleteUsersRequest = {
        ids: [userId],
      };

      await firstValueFrom(
        this.apiService.deleteUsers(request).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      this.loadUsers(this.currentPage);
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
    }
  }
}
