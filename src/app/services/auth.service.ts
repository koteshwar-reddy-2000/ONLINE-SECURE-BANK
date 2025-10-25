import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('securebank_user');
  }

  login(username: string, password: string): Observable<boolean> {
    // Get stored users
    const validUsers = this.getStoredUsers();
    const expectedPassword = validUsers[username];
    const isValid = !!expectedPassword && expectedPassword === password;

    if (!isValid) {
      return of(false);
    }

    // Get user-specific balance or create new user with default balance
    const userBalance = this.getUserBalance(username);
    const user = { username, balance: userBalance, transactions: [] };
    localStorage.setItem('securebank_user', JSON.stringify(user));
    this.loggedIn$.next(true);
    return of(true);
  }

  logout() {
    localStorage.removeItem('securebank_user');
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getUser(): any {
    const raw = localStorage.getItem('securebank_user');
    return raw ? JSON.parse(raw) : null;
  }

  updateUser(user: any) {
    localStorage.setItem('securebank_user', JSON.stringify(user));
    this.loggedIn$.next(true);
  }

  register(username: string, password: string): Observable<{success: boolean, message: string}> {
    // Check if user already exists
    const existingUsers = this.getStoredUsers();
    if (existingUsers[username]) {
      return of({success: false, message: 'Username already exists'});
    }

    // Add new user to stored users
    existingUsers[username] = password;
    localStorage.setItem('securebank_users', JSON.stringify(existingUsers));
    
    // Set initial balance for new user
    const initialBalance = this.getInitialBalanceForNewUser();
    this.setUserBalance(username, initialBalance);
    
    return of({success: true, message: 'Registration successful'});
  }

  private getStoredUsers(): Record<string, string> {
    const stored = localStorage.getItem('securebank_users');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with default users
    const defaultUsers = {
      'admin': 'admin123',
      'user': 'user123',
      'laxmi': 'laxmi123',
      'sagrika':'sag123',
      'lyan': 'lyan123',
    };
    localStorage.setItem('securebank_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  private getUserBalance(username: string): number {
    const storedBalances = this.getStoredBalances();
    return storedBalances[username] || this.getDefaultBalanceForUser(username);
  }

  private setUserBalance(username: string, balance: number): void {
    const storedBalances = this.getStoredBalances();
    storedBalances[username] = balance;
    localStorage.setItem('securebank_balances', JSON.stringify(storedBalances));
  }

  private getStoredBalances(): Record<string, number> {
    const stored = localStorage.getItem('securebank_balances');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with default balances for existing users
    const defaultBalances = {
      'admin': 500000,    // Admin gets highest balance
      'user': 25000,      // Regular user gets moderate balance
      'laxmi': 150000,    // Laxmi gets good balance
      'sagrika': 200000,  // Sagrika gets high balance
      'lyan': 75000,      // Lyan gets decent balance
    };
    localStorage.setItem('securebank_balances', JSON.stringify(defaultBalances));
    return defaultBalances;
  }

  private getDefaultBalanceForUser(username: string): number {
    // Assign different balances based on username patterns or random amounts
    const balances = {
      'admin': 500000,
      'user': 25000,
      'laxmi': 150000,
      'sagrika': 200000,
      'lyan': 75000,
    };
    
    return balances[username as keyof typeof balances] || this.getInitialBalanceForNewUser();
  }

  private getInitialBalanceForNewUser(): number {
    // Generate random initial balance between 10,000 and 100,000 for new users
    return Math.floor(Math.random() * 90000) + 10000;
  }
}

