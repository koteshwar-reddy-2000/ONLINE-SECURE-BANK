import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];

  constructor(private tx: TransactionService) {}

  ngOnInit() {
    this.tx.getTransactions().subscribe(list => this.transactions = list);
  }
}
