import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditUserComponent } from './edit-user';
import { ApiService } from '../../../services/ApiService';
import type { User, Card } from '../../../services/api.types';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@test.com',
    role: 'USER',
  };

  const mockCards: Card[] = [
    {
      number: 1234567890123456,
      userId: 1,
      title: 'Card 1',
      type: 'COMUM',
      status: true,
    },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'getUserById',
      'updateUser',
      'listAllCards',
      'createCard',
      'updateCard',
      'deleteCards',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditUserComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    apiService.getUserById.and.returnValue(of(mockUser));
    apiService.listAllCards.and.returnValue(
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

  it('should load user data on init', async () => {
    await component.ngOnInit();
    expect(apiService.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.userData.name).toBe('John Doe');
  });

  it('should return correct card type label', () => {
    expect(component.getCardTypeLabel('COMUM')).toBe('Comum');
    expect(component.getCardTypeLabel('ESTUDANTE')).toBe('Estudante');
    expect(component.getCardTypeLabel('TRABALHADOR')).toBe('Trabalhador');
  });

  it('should return correct role label', () => {
    expect(component.getRoleLabel('ADMIN')).toBe('Administrador');
    expect(component.getRoleLabel('USER')).toBe('Usuário');
  });

  it('should update user successfully', async () => {
    component.user = mockUser;
    component.userData = { name: 'Updated Name', email: 'updated@test.com' };
    apiService.updateUser.and.returnValue(of({ ...mockUser, name: 'Updated Name' }));

    await component.onSubmit();

    expect(apiService.updateUser).toHaveBeenCalledWith(1, component.userData);
    expect(component.successMessage).toContain('sucesso');
  });

  it('should show error when required fields are empty', async () => {
    component.user = mockUser;
    component.userData = { name: '', email: '' };

    await component.onSubmit();

    expect(component.errorMessage).toContain('obrigatórios');
    expect(apiService.updateUser).not.toHaveBeenCalled();
  });

  it('should navigate back to users list', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
  });

  it('should open card modal', () => {
    component.user = mockUser;
    component.openCardModal();
    expect(component.showCardModal).toBe(true);
    expect(component.cardForm.userId).toBe(1);
  });

  it('should close card modal', () => {
    component.showCardModal = true;
    component.closeCardModal();
    expect(component.showCardModal).toBe(false);
  });

  it('should create card', async () => {
    component.user = mockUser;
    component.cardForm = { userId: 1, title: 'New Card', type: 'COMUM' };
    apiService.createCard.and.returnValue(of(mockCards[0]));
    apiService.listAllCards.and.returnValue(
      of({
        content: [...mockCards, mockCards[0]],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 2,
      })
    );

    await component.onCreateCard();

    expect(apiService.createCard).toHaveBeenCalled();
    expect(component.showCardModal).toBe(false);
  });

  it('should toggle card status', async () => {
    component.user = mockUser;
    component.userCards = [...mockCards];
    apiService.updateCard.and.returnValue(of({ ...mockCards[0], status: false }));
    apiService.listAllCards.and.returnValue(
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

  it('should calculate page numbers', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    const pages = component.getPageNumbers();
    expect(pages.length).toBeGreaterThan(0);
  });
});
