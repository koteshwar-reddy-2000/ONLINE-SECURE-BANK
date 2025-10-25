import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private auth: AuthService) {}

  getTransactions() {
    const user = this.auth.getUser();
    return of(user?.transactions || []);
  }

  addTransaction(tx: any) {
    const user = this.auth.getUser();
    user.transactions = user.transactions || [];
    user.transactions.unshift(tx); // add latest at top
    this.auth.updateUser(user);
    return of(true);
  }
}
