import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/ApiService';
import type { Card, DeleteCardsRequest } from '../../../services/api.types';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal';
import { ActionDropdownComponent, ActionItem } from '../../../components/action-dropdown/action-dropdown';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, ConfirmModalComponent, ActionDropdownComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class CardsComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  cards: Card[] = [];
  isLoading = true;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;
  openDropdownCardNumber: number | null = null;
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalDanger = false;
  cardToDelete: number | null = null;
  cardToToggle: number | null = null;

  ngOnInit(): void {
    this.loadCards(0);
  }

  loadCards(page: number): void {
    this.isLoading = true;
    this.currentPage = page;

    this.apiService.listAllCards({ page, size: this.pageSize, sort: 'number,asc' }).pipe(
      catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))
    ).subscribe({
      next: (response) => {
        this.cards = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
      },
      error: (error) => {
        console.error('Erro ao carregar cartões:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadCards(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadCards(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadCards(this.currentPage - 1);
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

  getCardTypeLabel(type: string): string {
    const types: Record<string, string> = {
      COMUM: 'Comum',
      ESTUDANTE: 'Estudante',
      TRABALHADOR: 'Trabalhador',
    };
    return types[type] || type;
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

  toggleDropdown(cardNumber: number): void {
    this.openDropdownCardNumber = this.openDropdownCardNumber === cardNumber ? null : cardNumber;
  }

  closeDropdown(): void {
    this.openDropdownCardNumber = null;
  }

  async toggleCardStatus(cardNumber: number): Promise<void> {
    const card = this.cards.find(c => c.number === cardNumber);
    if (!card) return;

    this.closeDropdown();

    try {
      await firstValueFrom(
        this.apiService.updateCard(cardNumber, { status: !card.status }).pipe(
          catchError((error) => {
            throw error;
          })
        )
      );

      this.loadCards(this.currentPage);
    } catch (error: any) {
      console.error('Erro ao alterar status do cartão:', error);
    }
  }

  removeCard(cardNumber: number): void {
    const card = this.cards.find(c => c.number === cardNumber);
    if (!card) return;

    this.closeDropdown();
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

      this.loadCards(this.currentPage);
    } catch (error: any) {
      console.error('Erro ao remover cartão:', error);
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
      this.removeCard(cardNumber);
    }
  }
}
