import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent {
  form = this.fb.group({
    toAccount: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    note: ['']
  });

  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private txService: TransactionService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;
    const user = this.auth.getUser();
    const amount = Number(this.form.value.amount);
    if (amount > user.balance) {
      this.error = 'Insufficient balance';
      return;
    }
    const tx = {
      id: Date.now(),
      type: 'debit',
      amount,
      toAccount: this.form.value.toAccount,
      note: this.form.value.note,
      date: new Date().toISOString()
    };
    user.balance -= amount;
    this.auth.updateUser(user);
    this.txService.addTransaction(tx).subscribe(() => {
      this.success = 'Transfer successful';
      setTimeout(() => this.router.navigate(['/transactions']), 100000);
    });
  }
}
