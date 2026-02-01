import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register';
import { ApiService } from '../../../services/ApiService';
import type { User } from '../../../services/api.types';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should initialize with empty form', () => {
    expect(component.userData.name).toBe('');
    expect(component.userData.email).toBe('');
    expect(component.userData.password).toBe('');
    expect(component.userData.role).toBe('USER');
  });

  it('should validate password rules', () => {
    component.validatePassword('Test123!');
    expect(component.passwordRules.minLength).toBe(true);
    expect(component.passwordRules.hasUpperCase).toBe(true);
    expect(component.passwordRules.hasLowerCase).toBe(true);
    expect(component.passwordRules.hasNumber).toBe(true);
    expect(component.passwordRules.hasSpecialChar).toBe(true);
  });

  it('should detect invalid password length', () => {
    component.validatePassword('Short1!');
    expect(component.passwordRules.minLength).toBe(false);
  });

  it('should detect missing uppercase', () => {
    component.validatePassword('test123!');
    expect(component.passwordRules.hasUpperCase).toBe(false);
  });

  it('should detect missing lowercase', () => {
    component.validatePassword('TEST123!');
    expect(component.passwordRules.hasLowerCase).toBe(false);
  });

  it('should detect missing number', () => {
    component.validatePassword('TestPass!');
    expect(component.passwordRules.hasNumber).toBe(false);
  });

  it('should detect missing special character', () => {
    component.validatePassword('Test1234');
    expect(component.passwordRules.hasSpecialChar).toBe(false);
  });

  it('should return true when password is valid', () => {
    component.passwordRules = {
      minLength: true,
      hasUpperCase: true,
      hasLowerCase: true,
      hasNumber: true,
      hasSpecialChar: true,
    };
    expect(component.isPasswordValid).toBe(true);
  });

  it('should return false when password is invalid', () => {
    component.passwordRules = {
      minLength: false,
      hasUpperCase: true,
      hasLowerCase: true,
      hasNumber: true,
      hasSpecialChar: true,
    };
    expect(component.isPasswordValid).toBe(false);
  });

  it('should register user successfully', async () => {
    component.userData = {
      name: 'New User',
      email: 'newuser@test.com',
      password: 'Password123!',
      role: 'USER',
    };
    const newUser: User = {
      id: 3,
      name: 'New User',
      email: 'newuser@test.com',
      role: 'USER',
    };
    apiService.register.and.returnValue(of(newUser));

    await component.onSubmit();

    expect(apiService.register).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: 'New User',
        email: 'newuser@test.com',
        password: 'Password123!',
        role: 'USER',
      })
    );
    expect(component.successMessage).toContain('sucesso');
  });

  it('should handle registration error', async () => {
    component.userData = {
      name: 'Test',
      email: 'test@test.com',
      password: 'Test123!',
      role: 'USER',
    };
    apiService.register.and.returnValue(
      throwError(() => ({ error: { message: 'Email already exists' } }))
    );

    await component.onSubmit();

    expect(component.errorMessage).toBe('Email already exists');
    expect(component.isLoading).toBe(false);
  });
});
