import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MyCardsComponent } from './mycards';
import { ApiService } from '../../services/ApiService';
import type { Card } from '../../services/api.types';

describe('MyCardsComponent', () => {
  let component: MyCardsComponent;
  let fixture: ComponentFixture<MyCardsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockCards: Card[] = [
    {
      number: 1234567890123456,
      userId: 1,
      title: 'My Card',
      type: 'COMUM',
      status: true,
    },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getMyCards']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MyCardsComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCardsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    apiService.getMyCards.and.returnValue(
      of({
        content: mockCards,
        totalElements: 1,
        totalPages: 1,
        size: 100,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
      })
    );
  });

  it('should load cards on init', () => {
    component.ngOnInit();
    expect(apiService.getMyCards).toHaveBeenCalled();
    expect(component.myCards.length).toBe(1);
  });

  it('should return correct card type label', () => {
    expect(component.getCardTypeLabel('COMUM')).toBe('Comum');
    expect(component.getCardTypeLabel('ESTUDANTE')).toBe('Estudante');
    expect(component.getCardTypeLabel('TRABALHADOR')).toBe('Trabalhador');
  });

  it('should navigate to login on error', () => {
    apiService.getMyCards.and.returnValue(
      of({
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 100,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 0,
      })
    );
    component.loadData();
    expect(component.isLoading).toBe(false);
  });
});
