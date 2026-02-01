import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/ApiService';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private apiService = inject(ApiService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.login(this.credentials).subscribe({
      next: async (response) => {
        this.apiService.setToken(response.token);
        
        try {
          const user = await firstValueFrom(this.apiService.getMe());
          
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/myaccount']);
          }
        } catch (error) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      },
    });
  }
}
