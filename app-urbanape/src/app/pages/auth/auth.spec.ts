import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Auth } from './auth';
import { ApiService } from '../../services/ApiService';
import type { User } from '../../services/api.types';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['login', 'setToken', 'getMe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should initialize component', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when email is empty', () => {
    component.credentials.password = 'password123';
    component.onSubmit();

    expect(component.errorMessage).toContain('preencha todos os campos');
    expect(apiService.login).not.toHaveBeenCalled();
  });

  it('should show error when password is empty', () => {
    component.credentials.email = 'test@example.com';
    component.onSubmit();

    expect(component.errorMessage).toContain('preencha todos os campos');
    expect(apiService.login).not.toHaveBeenCalled();
  });

  it('should call login service with credentials', () => {
    component.credentials.email = 'user@test.com';
    component.credentials.password = 'pass123';
    apiService.login.and.returnValue(of({ token: 'fake-token' }));
    apiService.getMe.and.returnValue(of({ id: 1, name: 'User', email: 'user@test.com', role: 'USER' } as User));

    component.onSubmit();

    expect(apiService.login).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'pass123',
    });
  });

  it('should navigate to admin dashboard when user is admin', async () => {
    component.credentials.email = 'admin@test.com';
    component.credentials.password = 'admin123';
    apiService.login.and.returnValue(of({ token: 'admin-token' }));
    apiService.getMe.and.returnValue(
      of({ id: 1, name: 'Admin', email: 'admin@test.com', role: 'ADMIN' } as User)
    );

    component.onSubmit();
    await fixture.whenStable();

    expect(apiService.setToken).toHaveBeenCalledWith('admin-token');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should navigate to myaccount when user is not admin', async () => {
    component.credentials.email = 'user@test.com';
    component.credentials.password = 'user123';
    apiService.login.and.returnValue(of({ token: 'user-token' }));
    apiService.getMe.and.returnValue(
      of({ id: 2, name: 'User', email: 'user@test.com', role: 'USER' } as User)
    );

    component.onSubmit();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/myaccount']);
  });

  it('should handle login error', () => {
    component.credentials.email = 'wrong@test.com';
    component.credentials.password = 'wrong';
    apiService.login.and.returnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should navigate to login when getMe fails', async () => {
    component.credentials.email = 'test@test.com';
    component.credentials.password = 'test123';
    apiService.login.and.returnValue(of({ token: 'token' }));
    apiService.getMe.and.returnValue(throwError(() => new Error('Failed')));

    component.onSubmit();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
