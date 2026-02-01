import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/ApiService';
import type { RegisterRequest } from '../../../services/api.types';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  userData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    role: 'USER',
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  passwordRules = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  get isPasswordValid(): boolean {
    return Object.values(this.passwordRules).every(rule => rule === true);
  }

  validatePassword(password: string): void {
    this.passwordRules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }

  async onSubmit(): Promise<void> {
    if (!this.userData.name || !this.userData.email || !this.userData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.validatePassword(this.userData.password);
    if (!this.isPasswordValid) {
      this.errorMessage = 'A senha não atende aos requisitos mínimos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await firstValueFrom(this.apiService.register(this.userData));
      
      this.successMessage = 'Usuário cadastrado com sucesso!';
      
      this.userData = {
        name: '',
        email: '',
        password: '',
        role: 'USER',
      };
      this.passwordRules = {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      };

      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 2000);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage =
        error.error?.message || 'Erro ao cadastrar usuário. Tente novamente.';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
