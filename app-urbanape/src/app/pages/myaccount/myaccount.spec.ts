import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MyAccountComponent } from './myaccount';
import { ApiService } from '../../services/ApiService';
import type { User, Card } from '../../services/api.types';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  };

  const mockCards: Card[] = [
    {
      number: 1234567890123456,
      userId: 1,
      title: 'Cartão Principal',
      type: 'COMUM',
      status: true,
    },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getMe', 'getMyCards', 'updateCard', 'deleteCards']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MyAccountComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    apiService.getMe.and.returnValue(of(mockUser));
    apiService.getMyCards.and.returnValue(
      of({
        content: mockCards,
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
      })
    );
  });

  it('should load user and cards on init', () => {
    component.ngOnInit();
    expect(apiService.getMe).toHaveBeenCalled();
    expect(apiService.getMyCards).toHaveBeenCalled();
  });

  it('should return correct card type label', () => {
    expect(component.getCardTypeLabel('COMUM')).toBe('Comum');
    expect(component.getCardTypeLabel('ESTUDANTE')).toBe('Estudante');
    expect(component.getCardTypeLabel('TRABALHADOR')).toBe('Trabalhador');
    expect(component.getCardTypeLabel('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should return correct role label', () => {
    expect(component.getRoleLabel('ADMIN')).toBe('Administrador');
    expect(component.getRoleLabel('USER')).toBe('Usuário');
  });

  it('should return empty actions for non-admin users', () => {
    component.currentUser = { ...mockUser, role: 'USER' };
    const actions = component.getCardActions(mockCards[0]);
    expect(actions.length).toBe(0);
  });

  it('should return actions for admin users', () => {
    component.currentUser = { ...mockUser, role: 'ADMIN' };
    const actions = component.getCardActions(mockCards[0]);
    expect(actions.length).toBe(2);
    expect(actions[0].action).toBe('toggle');
    expect(actions[1].action).toBe('remove');
  });

  it('should toggle card dropdown', () => {
    component.toggleCardDropdown(123);
    expect(component.openDropdownCardNumber).toBe(123);

    component.toggleCardDropdown(123);
    expect(component.openDropdownCardNumber).toBeNull();
  });

  it('should close card dropdown', () => {
    component.openDropdownCardNumber = 123;
    component.closeCardDropdown();
    expect(component.openDropdownCardNumber).toBeNull();
  });

  it('should navigate to login when user is null', () => {
    apiService.getMe.and.returnValue(of(null as any));
    component.loadData();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle card action toggle', async () => {
    component.myCards = [...mockCards];
    apiService.updateCard.and.returnValue(of({ ...mockCards[0], status: false }));
    apiService.getMe.and.returnValue(of(mockUser));
    apiService.getMyCards.and.returnValue(
      of({
        content: [{ ...mockCards[0], status: false }],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
      })
    );

    await component.toggleCardStatus(mockCards[0].number);
    expect(apiService.updateCard).toHaveBeenCalledWith(mockCards[0].number, { status: false });
  });
});
