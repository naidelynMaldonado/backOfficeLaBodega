import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from '../../core/auth/auth.service';
import { LoginRequest, LoginResponse } from './login.types';
import { SvgIconComponent } from '../../shared/components/iconSvg/iconSvg.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  code: string = '';

  timeRemaining: number = 0; 
  interval: any;

  constructor(
    private router:Router,
    private loginService: LoginService,
    private userService: UserService,
    private alertService: AlertService,
    private msal: MsalService
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.loginService.isAuthenticated()) {
      this.router.navigate(['/office/home']);
    }
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  resendCode() {
    if(this.email !== '') {
      if (this.timeRemaining > 0) {
        return; 
      }
    
      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const formData: updatePassword = {
          to: this.email || '',
          password: randomNumber.toString() || '',
      };
    
      this.alertService.showInfo(
        `Tu nuevo código de acceso ha sido enviado a tu correo`
      );
    
      this.userService.newPassword(formData).pipe(
        switchMap(() => this.userService.updatePassword(formData)) 
      ).subscribe({
        next: () => {},
        error: (err: any) => {
          this.alertService.showError(`Error al mandar el nuevo código de acceso: ${err}`);
        }
      });
    
      this.timeRemaining = 30;
      this.startCountdown();
    }
    else {
      this.alertService.showError(`Inresa un correo electronico para poder mandar tu nuevo codigo de acceso`);
    }
  }
  
  login() {
    if (this.email) {
      this.loginService.login(this.email, this.code).subscribe({
        next: (response: LoginColaborador) => {
  
          // Guardar tokens en sessionStorage o localStorage
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('refreshToken', response.refreshToken);
          sessionStorage.setItem('usuarioId', response.id.toString());
          sessionStorage.setItem('usuario', response.correo);
          sessionStorage.setItem('username', response.nombre);

          if (this.code === response.password) {
            this.router.navigate(['/office/home']);
          } else {
            this.alertService.showError('Código de acceso incorrecto');
          }
        },
        error: (err: any) => {
          console.error('Error al buscar colaborador:', err);
          this.alertService.showError('Error al buscar colaborador: ' + err);
        }
      });
    } else {
      this.alertService.showError('Ingresa un correo electrónico');
    }
  }
  loginWithMicrosoft() { 
    const config = environment.msalConfigs.auth;      
    const scopes = environment.scopes;

    localStorage.setItem('postLogin', 'true');

    const request = {
      scopes,
      authority: config.authority,
      redirectUri: config.redirectUri,
      redirectStartPage: '/auth-callback'
    };
    console.log(request);
    this.msal.loginRedirect({
      scopes: request.scopes,
      authority: request.authority,
      redirectUri: request.redirectUri,
      redirectStartPage: '/auth-callback' 
    });
  }
}
