import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alerts',
  template: `<h3>Alerts</h3>
             <div *ngIf="lowBalance">⚠️ Low balance: ₹{{balance}}</div>
             <div *ngIf="!lowBalance">All good</div>`
})
export class AlertsComponent implements OnInit {
  balance = 0;
  lowBalance = false;
  threshold = 200;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.balance = user?.balance || 0;
    this.lowBalance = this.balance < this.threshold;
  }
}
