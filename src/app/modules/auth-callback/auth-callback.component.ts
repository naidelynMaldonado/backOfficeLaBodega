import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { LoginService } from '../login/login.service';
// import { AlertService } from '../../shared/service/alert/alert.service';
import { LoginColaborador } from '../login/login.types';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, LoaderComponent],
})
export class AuthCallbackComponent implements OnInit {
  private msalService = inject(MsalService);
  private router = inject(Router);
  private loginService = inject(LoginService)
  // private alertService = inject(AlertService)


  loading = true;

  ngOnInit(): void {
    if (localStorage.getItem('postLogin') !== 'true') {
      console.warn('[AuthCallback] postLogin flag missing, redirecting to /login');
      this.router.navigate(['/login']);
      return;
    }

    this.msalService.instance.handleRedirectPromise()
      .then((authResult) => {
        console.log('[AuthCallback] handleRedirectPromise result:', authResult);

        const accountFromResult = (authResult as any)?.account ?? null;
        if (accountFromResult) {
          try {
            this.msalService.instance.setActiveAccount(accountFromResult);
          } catch (e) {
            console.warn('[AuthCallback] setActiveAccount failed:', e);
          }
        }

        this.finishLogin();
      })
      .catch((err) => {
        console.error('[AuthCallback] handleRedirectPromise error:', err);
        this.fail();
      });
  
    
  }
  


  private finishLogin(): void {
    const account =
      this.msalService.instance.getActiveAccount();

    if (!account) {
      console.warn('[AuthCallback] Sin cuenta activa. Regreso a /login');
      return this.fail();
    }

    const email = account.username;
    console.log('[AuthCallback] email:', email);

    this.loginService.login(email, null).subscribe({
      next: (response: LoginColaborador) => {
  

       // Guardar tokens en sessionStorage o localStorage
       sessionStorage.setItem('accessToken', response.accessToken);
       sessionStorage.setItem('refreshToken', response.refreshToken);
       sessionStorage.setItem('usuarioId', response.id.toString());
       sessionStorage.setItem('username', response.nombre);
       sessionStorage.setItem('rolename', response.rolnombre);
  // Clear postLogin flag and navigate to dashboard
  localStorage.removeItem('postLogin');
  this.router.navigate(['/main/dashboard']);
      },
      error: (err: any) => {
        console.error('Error al buscar colaborador:', err);
        // this.alertService.showError('Error al buscar colaborador: ' + err);
      }
    });
  }

  private fail(): void {
    localStorage.removeItem('postLogin');
  this.loading = false;
  this.router.navigateByUrl('/');
  }
}
