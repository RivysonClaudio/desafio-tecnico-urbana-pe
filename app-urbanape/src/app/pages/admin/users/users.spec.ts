import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UsersComponent } from './users';
import { ApiService } from '../../../services/ApiService';
import type { User } from '../../../services/api.types';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsers: User[] = [
    { id: 1, name: 'User One', email: 'user1@test.com', role: 'USER' },
    { id: 2, name: 'User Two', email: 'user2@test.com', role: 'ADMIN' },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['listAllUsers', 'deleteUsers']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    apiService.listAllUsers.and.returnValue(
      of({
        content: mockUsers,
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 2,
      })
    );
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(apiService.listAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should return correct role label', () => {
    expect(component.getRoleLabel('ADMIN')).toBe('Administrador');
    expect(component.getRoleLabel('USER')).toBe('Usuário');
  });

  it('should format date correctly', () => {
    const dateStr = '2024-01-15T10:30:00Z';
    const formatted = component.formatDate(dateStr);
    expect(formatted).toContain('15/01/2024');
  });

  it('should return dash for empty date', () => {
    expect(component.formatDate()).toBe('-');
    expect(component.formatDate('')).toBe('-');
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/register']);
  });

  it('should calculate page numbers correctly', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    const pages = component.getPageNumbers();
    expect(pages.length).toBeGreaterThan(0);
    expect(pages).toContain(5);
  });

  it('should go to next page', () => {
    component.currentPage = 0;
    component.totalPages = 5;
    spyOn(component, 'loadUsers');
    component.nextPage();
    expect(component.loadUsers).toHaveBeenCalledWith(1);
  });

  it('should not go to next page if on last page', () => {
    component.currentPage = 4;
    component.totalPages = 5;
    spyOn(component, 'loadUsers');
    component.nextPage();
    expect(component.loadUsers).not.toHaveBeenCalled();
  });

  it('should go to previous page', () => {
    component.currentPage = 2;
    spyOn(component, 'loadUsers');
    component.previousPage();
    expect(component.loadUsers).toHaveBeenCalledWith(1);
  });

  it('should not go to previous page if on first page', () => {
    component.currentPage = 0;
    spyOn(component, 'loadUsers');
    component.previousPage();
    expect(component.loadUsers).not.toHaveBeenCalled();
  });

  it('should load users with search query', () => {
    component.searchQuery = 'test';
    component.onSearch();
    expect(apiService.listAllUsers).toHaveBeenCalled();
  });

  it('should clear search and reload', () => {
    component.searchQuery = 'test';
    component.clearSearch();
    expect(component.searchQuery).toBe('');
    expect(apiService.listAllUsers).toHaveBeenCalled();
  });

  it('should open remove user modal', () => {
    component.users = [...mockUsers];
    component.removeUser(1);
    expect(component.showConfirmModal).toBe(true);
    expect(component.userToDelete).toBe(1);
    expect(component.confirmModalDanger).toBe(true);
  });

  it('should delete user on confirm', async () => {
    component.userToDelete = 1;
    component.currentPage = 0;
    apiService.deleteUsers.and.returnValue(of(undefined));
    apiService.listAllUsers.and.returnValue(
      of({
        content: [mockUsers[1]],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
      })
    );

    await component.deleteUser(1);
    expect(apiService.deleteUsers).toHaveBeenCalled();
  });
});
