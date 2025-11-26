<<<<<<< ours
import { Component, OnInit, inject } from '@angular/core';
=======
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
>>>>>>> theirs
import { FormBuilder, Validators } from '@angular/forms';
<<<<<<< ours
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { AuthService } from '../services/auth.service';
=======
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
>>>>>>> theirs

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
<<<<<<< ours
export class LoginPage implements OnInit {
=======
export class LoginPage implements OnInit, OnDestroy {
>>>>>>> theirs
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly authService = inject(AuthService);
<<<<<<< ours
=======
  private sessionSub?: Subscription;
>>>>>>> theirs

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;

<<<<<<< ours
  async ngOnInit(): Promise<void> {
    const alreadyLoggedIn = await firstValueFrom(this.authService.isAuthenticated$);
    if (alreadyLoggedIn) {
      this.router.navigateByUrl('/lista', { replaceUrl: true });
    }
=======
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
>>>>>>> theirs
  }

  async submit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
<<<<<<< ours
    const credentials = this.loginForm.getRawValue();
    const loggedIn = await this.authService.login(credentials.email, credentials.password);
    this.isSubmitting = false;

    const { email } = this.loginForm.getRawValue();
    await this.authService.login(email);
    await Haptics.impact({ style: ImpactStyle.Light });

    const toast = await this.toastController.create({
<<<<<<< ours
      message: '¡Bienvenida/o a EcoLista! Sesión guardada en el dispositivo.',
=======
      message: loggedIn
        ? 'Sesión iniciada. Tu navegación ahora es segura.'
        : 'Credenciales inválidas. Usa un email válido y contraseña mínima de 6 caracteres.',
>>>>>>> theirs
      duration: 2200,
      color: loggedIn ? 'success' : 'danger',
      icon: loggedIn ? 'lock-open' : 'alert-circle',
    });
    await toast.present();

<<<<<<< ours
    this.router.navigateByUrl('/lista', { replaceUrl: true });
=======
    if (loggedIn) {
      const target = this.authService.consumeRedirectUrl() ?? '/home';
      this.router.navigateByUrl(target, { replaceUrl: true });
    }
>>>>>>> theirs
=======
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
        error: async () => {
          const toast = await this.toastController.create({
            message: 'No pudimos validar tus datos. Prueba de nuevo en unos segundos.',
            duration: 2200,
            color: 'danger',
            icon: 'alert-circle',
          });
          await toast.present();
        },
      });
>>>>>>> theirs
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
