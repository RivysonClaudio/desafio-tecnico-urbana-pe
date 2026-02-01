import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard';
import { ApiService } from '../../../services/ApiService';
import type { User, Card } from '../../../services/api.types';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockUsers: User[] = [
    { id: 1, name: 'User 1', email: 'user1@test.com', role: 'USER' },
    { id: 2, name: 'User 2', email: 'user2@test.com', role: 'ADMIN' },
  ];

  const mockCards: Card[] = [
    {
      number: 1234567890123456,
      userId: 1,
      title: 'Active Card',
      type: 'COMUM',
      status: true,
    },
    {
      number: 1234567890123457,
      userId: 2,
      title: 'Inactive Card',
      type: 'ESTUDANTE',
      status: false,
    },
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['listAllUsers', 'listAllCards']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    apiService.listAllUsers.and.returnValue(
      of({
        content: mockUsers,
        totalElements: 2,
        totalPages: 1,
        size: 100,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 2,
      })
    );

    apiService.listAllCards.and.returnValue(
      of({
        content: mockCards,
        totalElements: 2,
        totalPages: 1,
        size: 100,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 2,
      })
    );
  });

  it('should load data on init', () => {
    component.ngOnInit();
    expect(apiService.listAllUsers).toHaveBeenCalled();
    expect(apiService.listAllCards).toHaveBeenCalled();
  });

  it('should calculate stats correctly', () => {
    component.users = mockUsers;
    component.cards = mockCards;
    component.loadData();

    expect(component.stats.totalUsers).toBe(2);
    expect(component.stats.totalCards).toBe(2);
    expect(component.stats.activeCards).toBe(1);
  });

  it('should set loading to false after data load', () => {
    component.loadData();
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty data', () => {
    apiService.listAllUsers.and.returnValue(
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
    apiService.listAllCards.and.returnValue(
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

    expect(component.stats.totalUsers).toBe(0);
    expect(component.stats.totalCards).toBe(0);
    expect(component.stats.activeCards).toBe(0);
  });
});
