import { Component, inject } from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    void this.authService.init();
  }
}
