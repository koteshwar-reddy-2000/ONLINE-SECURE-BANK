import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.auth.isLoggedIn().pipe(
      take(1),
      map(logged => {
        if (!logged) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
