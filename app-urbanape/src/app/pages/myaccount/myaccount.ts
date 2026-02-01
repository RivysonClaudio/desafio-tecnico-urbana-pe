import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/ApiService';
import type { User, Card, DeleteCardsRequest } from '../../services/api.types';
import { ActionDropdownComponent, ActionItem } from '../../components/action-dropdown/action-dropdown';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-myaccount',
  imports: [CommonModule, ActionDropdownComponent, ConfirmModalComponent],
  templateUrl: './myaccount.html',
  styleUrl: './myaccount.css',
})
export class MyAccountComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  currentUser: User | null = null;
  myCards: Card[] = [];
  isLoading = true;
  openDropdownCardNumber: number | null = null;
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalDanger = false;
  cardToDelete: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin({
      user: this.apiService.getMe().pipe(catchError(() => of(null))),
      cards: this.apiService.getMyCards({ page: 0, size: 10, sort: 'number,asc' }).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))),
    }).subscribe({
      next: ({ user, cards }) => {
        this.currentUser = user;
        this.myCards = cards.content;

        if (!user) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getCardTypeLabel(type: string): string {
    const types: Record<string, string> = {
      COMUM: 'Comum',
      ESTUDANTE: 'Estudante',
      TRABALHADOR: 'Trabalhador',
    };
    return types[type] || type;
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrador' : 'Usuário';
  }

  toggleCardDropdown(cardNumber: number): void {
    this.openDropdownCardNumber = this.openDropdownCardNumber === cardNumber ? null : cardNumber;
  }

  closeCardDropdown(): void {
    this.openDropdownCardNumber = null;
  }

  async toggleCardStatus(cardNumber: number): Promise<void> {
    const card = this.myCards.find(c => c.number === cardNumber);
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

      this.loadData();
    } catch (error: any) {
      console.error('Erro ao alterar status do cartão:', error);
    }
  }

  openRemoveCardModal(cardNumber: number): void {
    const card = this.myCards.find(c => c.number === cardNumber);
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
      this.deleteCard(this.cardToDelete);
    }
    this.showConfirmModal = false;
    this.cardToDelete = null;
  }

  onCancelConfirmModal(): void {
    this.showConfirmModal = false;
    this.cardToDelete = null;
  }

  async deleteCard(cardNumber: number): Promise<void> {
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

      this.loadData();
    } catch (error: any) {
      console.error('Erro ao remover cartão:', error);
    }
  }

  getCardActions(card: Card): ActionItem[] {
    if (this.currentUser?.role !== 'ADMIN') {
      return [];
    }

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
