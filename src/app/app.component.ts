import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // ✅ using CSS file
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn().subscribe(status => this.isLoggedIn = status);
  }

  logout() {
    this.auth.logout();
  }
}
