import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);

  private sessionSub?: Subscription;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;

  ngOnInit(): void {
    this.sessionSub = this.authService.isAuthenticated$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const target = this.authService.consumeRedirectUrl() ?? '/home';
        this.router.navigateByUrl(target, { replaceUrl: true });
      }
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login(email, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: '¡Bienvenida/o a EcoLista! Ahora puedes gestionar tu compra responsable.',
            duration: 2200,
            color: 'success',
          });
          await toast.present();

          const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/home';
          this.router.navigateByUrl(redirect, { replaceUrl: true });
        },
        error: async (error) => {
          const isCredentialError = error instanceof Error && error.message === 'INVALID_CREDENTIALS';
          const message = isCredentialError
            ? 'Usuario o contraseña incorrectos. Usa las credenciales indicadas.'
            : 'No pudimos validar tus datos. Prueba de nuevo en unos segundos.';

          const toast = await this.toastController.create({
            message,
            duration: 2200,
            color: 'danger',
            icon: 'alert-circle',
          });
          await toast.present();
        },
      });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
