import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/ApiService';
import type { User, UpdateUserRequest, Card, CreateCardRequest, CardType, DeleteCardsRequest } from '../../../services/api.types';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal';
import { ActionDropdownComponent, ActionItem } from '../../../components/action-dropdown/action-dropdown';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, FormsModule, ConfirmModalComponent, ActionDropdownComponent],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUserComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user: User | null = null;
  userCards: Card[] = [];
  userData: UpdateUserRequest = {
    name: '',
    email: '',
    role: 'USER',
  };
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;
  showCardModal = false;
  isCreatingCard = false;
  cardForm: CreateCardRequest = {
    userId: 0,
    title: '',
    type: 'COMUM',
  };
  cardFormError = '';
  openDropdownCardNumber: number | null = null;
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalDanger = false;
  cardToDelete: number | null = null;
  cardToToggle: number | null = null;

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(Number(userId));
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  async loadUser(id: number): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = await firstValueFrom(
        this.apiService.getUserById(id).pipe(catchError(() => of(null)))
      );

      if (!user) {
        this.errorMessage = 'Usuário não encontrado.';
        this.router.navigate(['/admin/users']);
        return;
      }

      this.user = user;
      this.userData = {
        name: user.name,
        email: user.email,
        role: user.role,
      };
      this.cardForm.userId = user.id;

      await this.loadCards(id, 0);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      this.errorMessage = 'Erro ao carregar dados do usuário.';
      this.router.navigate(['/admin/users']);
    } finally {
      this.isLoading = false;
    }
  }

  async loadCards(userId: number, page: number): Promise<void> {
    this.currentPage = page;

    try {
      const cardsResponse = await firstValueFrom(
        this.apiService.listAllCards({ page, size: this.pageSize, sort: 'number,asc', user: userId }).pipe(
          catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))
        )
      );

      this.userCards = cardsResponse.content;
      this.totalPages = cardsResponse.totalPages;
      this.totalElements = cardsResponse.totalElements;
      this.currentPage = cardsResponse.number;
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    }
  }

  goToPage(page: number): void {
    if (this.user && page >= 0 && page < this.totalPages) {
      this.loadCards(this.user.id, page);
    }
  }

  nextPage(): void {
    if (this.user && this.currentPage < this.totalPages - 1) {
      this.loadCards(this.user.id, this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.user && this.currentPage > 0) {
      this.loadCards(this.user.id, this.currentPage - 1);
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

  async onSubmit(): Promise<void> {
    if (!this.user) return;

    if (!this.userData.name || !this.userData.email) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const updatedUser = await firstValueFrom(
        this.apiService.updateUser(this.user.id, this.userData).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      this.successMessage = 'Usuário atualizado com sucesso!';
      this.user = updatedUser;

      setTimeout(() => {
        this.router.navigate(['/admin/users']);
      }, 2000);
    } catch (error: any) {
      this.isSaving = false;
      this.errorMessage =
        error.error?.message || 'Erro ao atualizar usuário. Tente novamente.';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrador' : 'Usuário';
  }

  getCardTypeLabel(type: string): string {
    const types: Record<string, string> = {
      COMUM: 'Comum',
      ESTUDANTE: 'Estudante',
      TRABALHADOR: 'Trabalhador',
    };
    return types[type] || type;
  }

  openCardModal(): void {
    if (!this.user) return;
    this.cardForm = {
      userId: this.user.id,
      title: '',
      type: 'COMUM',
    };
    this.cardFormError = '';
    this.showCardModal = true;
  }

  closeCardModal(): void {
    this.showCardModal = false;
    this.cardForm = {
      userId: 0,
      title: '',
      type: 'COMUM',
    };
    this.cardFormError = '';
  }

  async onCreateCard(): Promise<void> {
    if (!this.user) return;

    if (!this.cardForm.title || !this.cardForm.title.trim()) {
      this.cardFormError = 'Por favor, preencha o título do cartão.';
      return;
    }

    this.isCreatingCard = true;
    this.cardFormError = '';

    try {
      await firstValueFrom(
        this.apiService.createCard(this.cardForm).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      // Recarregar cartões na página atual
      await this.loadCards(this.user.id, this.currentPage);
      
      // Fechar modal
      this.closeCardModal();
    } catch (error: any) {
      this.cardFormError = error.error?.message || 'Erro ao criar cartão. Tente novamente.';
    } finally {
      this.isCreatingCard = false;
    }
  }

  toggleCardDropdown(cardNumber: number): void {
    this.openDropdownCardNumber = this.openDropdownCardNumber === cardNumber ? null : cardNumber;
  }

  closeCardDropdown(): void {
    this.openDropdownCardNumber = null;
  }

  async toggleCardStatus(cardNumber: number): Promise<void> {
    if (!this.user) return;

    const card = this.userCards.find(c => c.number === cardNumber);
    if (!card) return;

    this.closeCardDropdown();

    try {
      await firstValueFrom(
        this.apiService.updateCard(cardNumber, { status: !card.status }).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      // Recarregar cartões na página atual
      await this.loadCards(this.user.id, this.currentPage);
    } catch (error: any) {
      console.error('Erro ao alterar status do cartão:', error);
      this.errorMessage = error.error?.message || 'Erro ao alterar status do cartão. Tente novamente.';
    }
  }

  openRemoveCardModal(cardNumber: number): void {
    const card = this.userCards.find(c => c.number === cardNumber);
    if (!card) return;

    this.closeCardDropdown();
    this.cardToDelete = cardNumber;
    this.confirmModalTitle = 'Remover Cartão';
    this.confirmModalMessage = `Tem certeza que deseja remover o cartão "${card.title}" (${card.number})? Esta ação não pode ser desfeita.`;
    this.confirmModalDanger = true;
    this.showConfirmModal = true;
  }

  onConfirmRemoveCard(): void {
    if (this.cardToDelete !== null) {
      this.removeCard(this.cardToDelete);
    }
    this.showConfirmModal = false;
    this.cardToDelete = null;
  }

  onCancelConfirmModal(): void {
    this.showConfirmModal = false;
    this.cardToDelete = null;
  }

  async removeCard(cardNumber: number): Promise<void> {
    if (!this.user) return;

    try {
      const request: DeleteCardsRequest = {
        numbers: [cardNumber],
      };

      await firstValueFrom(
        this.apiService.deleteCards(request).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      // Recarregar cartões na página atual
      await this.loadCards(this.user.id, this.currentPage);
    } catch (error: any) {
      console.error('Erro ao remover cartão:', error);
      this.errorMessage = error.error?.message || 'Erro ao remover cartão. Tente novamente.';
    }
  }

  getCardActions(card: Card): ActionItem[] {
    return [
      {
        label: 'Ativar/Inativar',
        icon: 'toggle',
        action: 'toggle',
      },
      {
        label: 'Remover',
        icon: 'delete',
        action: 'remove',
        danger: true,
      },
    ];
  }

  onCardAction(cardNumber: number, action: string): void {
    if (action === 'toggle') {
      this.toggleCardStatus(cardNumber);
    } else if (action === 'remove') {
      this.openRemoveCardModal(cardNumber);
    }
  }
}
