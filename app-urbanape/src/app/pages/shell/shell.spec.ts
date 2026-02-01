import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ShellComponent } from './shell';
import { ApiService } from '../../services/ApiService';
import type { User } from '../../services/api.types';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getMe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: of({}),
      url: '/admin/dashboard',
    });

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('should load admin menu items when user is admin', () => {
    const adminUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'ADMIN',
    };

    component.isAdmin = true;
    const items = component.getMenuItems();

    expect(items.length).toBe(5);
    expect(items[0].label).toBe('Dashboard');
    expect(items[1].label).toBe('Usuários');
  });

  it('should load user menu items when user is not admin', () => {
    component.isAdmin = false;
    const items = component.getMenuItems();

    expect(items.length).toBe(2);
    expect(items[0].route).toBe('/myaccount');
    expect(items[1].route).toBe('/mycards');
  });

  it('should return correct page title for admin', () => {
    component.isAdmin = true;
    expect(component.getPageTitle()).toBe('Painel Administrativo');
  });

  it('should return correct page title for regular user', () => {
    component.isAdmin = false;
    expect(component.getPageTitle()).toBe('Minha Conta');
  });

  it('should toggle menu', () => {
    component.isMenuOpen = false;
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);

    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close menu', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should navigate to login on logout', () => {
    apiService.clearToken = jasmine.createSpy('clearToken');
    component.logout();
    expect(apiService.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login when user is null', () => {
    apiService.getMe.and.returnValue(of(null as any));
    component.loadUser();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set admin flag when user is admin', () => {
    const adminUser: User = {
      id: 1,
      name: 'Admin',
      email: 'admin@test.com',
      role: 'ADMIN',
    };
    apiService.getMe.and.returnValue(of(adminUser));
    component.loadUser();
    expect(component.isAdmin).toBe(true);
  });
});
