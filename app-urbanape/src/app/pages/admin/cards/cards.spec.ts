import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CardsComponent } from './cards';
import { ApiService } from '../../../services/ApiService';
import type { Card } from '../../../services/api.types';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockCards: Card[] = [
    {
      number: 1234567890123456,
      userId: 1,
      title: 'Card One',
      type: 'COMUM',
      status: true,
    },
    {
      number: 1234567890123457,
      userId: 2,
      title: 'Card Two',
      type: 'ESTUDANTE',
      status: false,
    },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['listAllCards', 'updateCard', 'deleteCards']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CardsComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    apiService.listAllCards.and.returnValue(
      of({
        content: mockCards,
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

  it('should load cards on init', () => {
    component.ngOnInit();
    expect(apiService.listAllCards).toHaveBeenCalled();
    expect(component.cards.length).toBe(2);
  });

  it('should return correct card type label', () => {
    expect(component.getCardTypeLabel('COMUM')).toBe('Comum');
    expect(component.getCardTypeLabel('ESTUDANTE')).toBe('Estudante');
    expect(component.getCardTypeLabel('TRABALHADOR')).toBe('Trabalhador');
  });

  it('should format date correctly', () => {
    const dateStr = '2024-01-20T14:30:00Z';
    const formatted = component.formatDate(dateStr);
    expect(formatted).toContain('20/01/2024');
  });

  it('should return dash for invalid date', () => {
    expect(component.formatDate()).toBe('-');
  });

  it('should toggle card status', async () => {
    component.cards = [...mockCards];
    apiService.updateCard.and.returnValue(of({ ...mockCards[0], status: false }));
    apiService.listAllCards.and.returnValue(
      of({
        content: [{ ...mockCards[0], status: false }, mockCards[1]],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 2,
      })
    );

    await component.toggleCardStatus(mockCards[0].number);

    expect(apiService.updateCard).toHaveBeenCalledWith(mockCards[0].number, { status: false });
  });

  it('should open remove card modal', () => {
    component.cards = [...mockCards];
    component.removeCard(mockCards[0].number);

    expect(component.showConfirmModal).toBe(true);
    expect(component.cardToDelete).toBe(mockCards[0].number);
    expect(component.confirmModalDanger).toBe(true);
  });

  it('should delete card', async () => {
    component.cardToDelete = mockCards[0].number;
    component.currentPage = 0;
    apiService.deleteCards.and.returnValue(of(undefined));
    apiService.listAllCards.and.returnValue(
      of({
        content: [mockCards[1]],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
      })
    );

    await component.deleteCard(mockCards[0].number);

    expect(apiService.deleteCards).toHaveBeenCalled();
  });

  it('should get card actions', () => {
    const actions = component.getCardActions(mockCards[0]);
    expect(actions.length).toBe(2);
    expect(actions[0].action).toBe('toggle');
    expect(actions[1].action).toBe('remove');
  });

  it('should handle card action toggle', () => {
    spyOn(component, 'toggleCardStatus');
    component.onCardAction(mockCards[0].number, 'toggle');
    expect(component.toggleCardStatus).toHaveBeenCalledWith(mockCards[0].number);
  });

  it('should handle card action remove', () => {
    spyOn(component, 'removeCard');
    component.onCardAction(mockCards[0].number, 'remove');
    expect(component.removeCard).toHaveBeenCalledWith(mockCards[0].number);
  });

  it('should navigate to next page', () => {
    component.currentPage = 0;
    component.totalPages = 3;
    spyOn(component, 'loadCards');
    component.nextPage();
    expect(component.loadCards).toHaveBeenCalledWith(1);
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    spyOn(component, 'loadCards');
    component.previousPage();
    expect(component.loadCards).toHaveBeenCalledWith(1);
  });
});
