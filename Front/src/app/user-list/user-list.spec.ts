import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UserList } from './user-list';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let mockUserService: any;

  const sampleUsers: User[] = [
    { id: 1, login: 'admin', nom: 'Admin', prenom: 'Super', email: 'admin@cnam.fr' },
    { id: 2, login: 'simon', nom: 'Erre', prenom: 'Simon', email: 'simon.erre@cnam.fr' },
    { id: 3, login: 'alice', nom: 'Dupont', prenom: 'Alice', email: 'alice.dupont@cnam.fr' },
  ];

  beforeEach(async () => {
    mockUserService = {
      getUsers: () => of(sampleUsers),
      deleteUser: (_id: number) => of({ success: true }),
    };

    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    expect(component.users().length).toBe(3);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter users based on searchQuery signal', () => {
    component.searchQuery.set('simon');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].login).toBe('simon');

    component.searchQuery.set('dupont');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].login).toBe('alice');

    component.searchQuery.set('');
    expect(component.filteredUsers().length).toBe(3);
  });

  it('should call deleteUser and remove user from list when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteUser(2, 'simon');
    expect(component.users().length).toBe(2);
    expect(component.users().find((u) => u.id === 2)).toBeUndefined();
    expect(component.notification()).toContain('simon');
  });
});
