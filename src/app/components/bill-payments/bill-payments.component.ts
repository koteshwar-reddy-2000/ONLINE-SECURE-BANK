import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-bill-payments',
  templateUrl: './bill-payments.component.html',
  styleUrls: ['./bill-payments.component.css']
})
export class BillPaymentsComponent {
  form = this.fb.group({
    biller: ['', Validators.required],
    category: ['Electricity', Validators.required],
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
      type: 'bill-payment',
      amount,
      toAccount: this.form.value.biller, // reuse field for display
      category: this.form.value.category,
      note: this.form.value.note,
      date: new Date().toISOString()
    };

    user.balance -= amount;
    this.auth.updateUser(user);

    this.txService.addTransaction(tx).subscribe(() => {
      this.success = 'Bill paid successfully';
      setTimeout(() => this.router.navigate(['/transactions']), 100000);
    });
  }
}
