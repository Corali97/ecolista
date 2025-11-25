import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly authService = inject(AuthService);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;

  async ngOnInit(): Promise<void> {
    const alreadyLoggedIn = await firstValueFrom(this.authService.isAuthenticated$);
    if (alreadyLoggedIn) {
      this.router.navigateByUrl('/lista', { replaceUrl: true });
    }
  }

  async submit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.isSubmitting = false;

    const { email } = this.loginForm.getRawValue();
    await this.authService.login(email);
    await Haptics.impact({ style: ImpactStyle.Light });

    const toast = await this.toastController.create({
      message: '¡Bienvenida/o a EcoLista! Sesión guardada en el dispositivo.',
      duration: 2200,
      color: 'success',
    });
    await toast.present();

    this.router.navigateByUrl('/lista', { replaceUrl: true });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
