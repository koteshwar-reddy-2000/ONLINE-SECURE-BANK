import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  isLoginMode = true;
  
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['']
  });

  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.updateValidators();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.form.reset();
    this.updateValidators();
  }

  private updateValidators() {
    const confirmPasswordControl = this.form.get('confirmPassword');
    if (this.isLoginMode) {
      confirmPasswordControl?.clearValidators();
    } else {
      confirmPasswordControl?.setValidators([Validators.required]);
    }
    confirmPasswordControl?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;
    const { username, password, confirmPassword } = this.form.value;
    this.error = '';
    this.success = '';

    if (!this.isLoginMode && password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.isLoginMode) {
      this.auth.login(username!, password!).subscribe(ok => {
        if (ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid username or password';
        }
      });
    } else {
      this.auth.register(username!, password!).subscribe(result => {
        if (result.success) {
          this.success = result.message;
          setTimeout(() => {
            this.toggleMode();
          }, 2000);
        } else {
          this.error = result.message;
        }
      });
    }
  }
}
