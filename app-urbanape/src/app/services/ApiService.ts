import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UpdateUserRequest,
  DeleteUsersRequest,
  Card,
  CreateCardRequest,
  UpdateCardRequest,
  DeleteCardsRequest,
  PageParams,
  PageResponse,
} from './api.types';

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.port === '4200' ? 'http://localhost:8080' : '';
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = getBaseUrl();

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/v1/auth/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/v1/auth/register`, userData, {
      headers: this.getHeaders(),
    });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/v1/users/me`, {
      headers: this.getHeaders(),
    });
  }

  listAllUsers(params?: PageParams): Observable<PageResponse<User>> {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams['page'] = params.page.toString();
    if (params?.size !== undefined) queryParams['size'] = params.size.toString();
    if (params?.sort) queryParams['sort'] = params.sort;
    if (params?.search) queryParams['search'] = params.search;

    return this.http.get<PageResponse<User>>(`${this.baseUrl}/api/v1/admin/users`, {
      headers: this.getHeaders(),
      params: queryParams,
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/v1/admin/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/api/v1/admin/users/${id}`, userData, {
      headers: this.getHeaders(),
    });
  }

  deleteUsers(request: DeleteUsersRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/users`, {
      headers: this.getHeaders(),
      body: request,
    });
  }

  getMyCards(params?: PageParams): Observable<PageResponse<Card>> {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams['page'] = params.page.toString();
    if (params?.size !== undefined) queryParams['size'] = params.size.toString();
    if (params?.sort) queryParams['sort'] = params.sort;

    return this.http.get<PageResponse<Card>>(`${this.baseUrl}/api/v1/cards/me`, {
      headers: this.getHeaders(),
      params: queryParams,
    });
  }

  getMyCardByNumber(number: number): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/api/v1/cards/me/${number}`, {
      headers: this.getHeaders(),
    });
  }

  listAllCards(params?: PageParams): Observable<PageResponse<Card>> {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams['page'] = params.page.toString();
    if (params?.size !== undefined) queryParams['size'] = params.size.toString();
    if (params?.sort) queryParams['sort'] = params.sort;
    if (params?.user !== undefined) queryParams['user'] = params.user.toString();

    return this.http.get<PageResponse<Card>>(`${this.baseUrl}/api/v1/admin/cards`, {
      headers: this.getHeaders(),
      params: queryParams,
    });
  }

  getCardByNumber(number: number): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/api/v1/admin/cards/${number}`, {
      headers: this.getHeaders(),
    });
  }

  createCard(cardData: CreateCardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.baseUrl}/api/v1/admin/cards`, cardData, {
      headers: this.getHeaders(),
    });
  }

  updateCard(number: number, cardData: UpdateCardRequest): Observable<Card> {
    return this.http.patch<Card>(`${this.baseUrl}/api/v1/admin/cards/${number}`, cardData, {
      headers: this.getHeaders(),
    });
  }

  deleteCards(request: DeleteCardsRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/cards`, {
      headers: this.getHeaders(),
      body: request,
    });
  }
}
