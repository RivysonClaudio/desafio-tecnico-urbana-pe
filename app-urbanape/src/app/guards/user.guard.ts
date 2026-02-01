import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/ApiService';

export const userGuard: CanActivateFn = async () => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  try {
    const user = await firstValueFrom(
      apiService.getMe().pipe(catchError(() => of(null)))
    );

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (user.role === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
      return false;
    }

    return true;
  } catch {
    router.navigate(['/login']);
    return false;
  }
};
