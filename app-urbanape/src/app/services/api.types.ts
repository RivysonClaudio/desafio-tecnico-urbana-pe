//#region Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}
//#endregion

//#region User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
}

export interface DeleteUsersRequest {
  ids: number[];
}
//#endregion

//#region Pagination Types
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
  user?: number;
  search?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
//#endregion

//#region Card Types
export type CardType = 'COMUM' | 'ESTUDANTE' | 'TRABALHADOR';

export interface Card {
  number: number;
  userId: number;
  title: string;
  type: CardType;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCardRequest {
  userId: number;
  title: string;
  type: CardType;
}

export interface UpdateCardRequest {
  title?: string;
  status?: boolean;
  type?: CardType;
}

export interface DeleteCardsRequest {
  numbers: number[];
}
//#endregion