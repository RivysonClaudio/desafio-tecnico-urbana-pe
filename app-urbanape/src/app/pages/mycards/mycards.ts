import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/ApiService';
import type { Card } from '../../services/api.types';

@Component({
  selector: 'app-mycards',
  imports: [CommonModule],
  templateUrl: './mycards.html',
  styleUrl: './mycards.css',
})
export class MyCardsComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  myCards: Card[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.apiService.getMyCards({ page: 0, size: 100, sort: 'number,asc' }).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))).subscribe({
      next: (response) => {
        this.myCards = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar cartões:', error);
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
}
