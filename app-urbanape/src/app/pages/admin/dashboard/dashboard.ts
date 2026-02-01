import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/ApiService';
import type { User, Card } from '../../../services/api.types';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  users: User[] = [];
  cards: Card[] = [];
  isLoading = true;

  stats = {
    totalUsers: 0,
    totalCards: 0,
    activeCards: 0,
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin({
      users: this.apiService.listAllUsers({ page: 0, size: 100, sort: 'id,asc' }).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))),
      cards: this.apiService.listAllCards({ page: 0, size: 100, sort: 'number,asc' }).pipe(catchError(() => of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0 }))),
    }).subscribe({
      next: ({ users, cards }) => {
        this.users = users.content;
        this.cards = cards.content;

        this.stats = {
          totalUsers: users.totalElements,
          totalCards: cards.totalElements,
          activeCards: cards.content.filter((card) => card.status).length,
        };
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
