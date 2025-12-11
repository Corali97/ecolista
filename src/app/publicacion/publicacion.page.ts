import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
  PLATFORM_CONFIG_TOKEN,
  PlatformConfig,
  resolvePlatformConfig,
  resolvePlatformTarget,
} from '../config/platform-config';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {
  readonly detectedPlatform = resolvePlatformTarget();
  readonly platformConfig: PlatformConfig;

  readonly form = this.fb.nonNullable.group({
    packageId: [
      '',
      [
        Validators.required,
        Validators.pattern(/[a-zA-Z]+(\.[a-zA-Z0-9_]+)+/),
      ],
    ],
    appName: ['', [Validators.required, Validators.minLength(3)]],
    versionName: [
      '1.0.0',
      [Validators.required, Validators.pattern(/^[0-9]+\.[0-9]+\.[0-9]+$/)],
    ],
    versionCode: [1, [Validators.required, Validators.min(1)]],
    developerEmail: ['', [Validators.required, Validators.email]],
    minSdkVersion: [21, [Validators.required, Validators.min(21)]],
    targetSdkVersion: [21, [Validators.required, Validators.min(21)]],
    buildType: ['apk', Validators.required],
    notes: ['', [Validators.required, Validators.minLength(8)]],
  });

  submissionPreview?: PlatformConfig;

  constructor(
    @Inject(FormBuilder) private readonly fb: FormBuilder,
    @Inject(PLATFORM_CONFIG_TOKEN) platformConfig?: PlatformConfig
  ) {
    this.platformConfig = platformConfig ?? resolvePlatformConfig();
  }

  ngOnInit(): void {
    this.applyPlatformDefaults();
  }

  applyPlatformDefaults(): void {
    const config = this.platformConfig;

    this.form.patchValue({
      packageId: config.packageId,
      appName: config.appName,
      developerEmail: config.developerEmail,
      minSdkVersion: config.minSdkVersion,
      targetSdkVersion: config.targetSdkVersion,
      notes: config.notes,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submissionPreview = {
      ...this.platformConfig,
      packageId: this.form.value.packageId!,
      appName: this.form.value.appName!,
      developerEmail: this.form.value.developerEmail!,
      minSdkVersion: this.form.value.minSdkVersion!,
      targetSdkVersion: this.form.value.targetSdkVersion!,
      notes: this.form.value.notes!,
      packaging: this.platformConfig.packaging,
    };
  }

  // GETTERS para acceder a los controles desde el HTML

  get packageIdControl() {
    return this.form.get('packageId');
  }

  get appNameControl() {
    return this.form.get('appName');
  }

  get versionNameControl() {
    return this.form.get('versionName');
  }

  get versionCodeControl() {
    return this.form.get('versionCode');
  }

  get developerEmailControl() {
    return this.form.get('developerEmail');
  }

  get minSdkControl() {
    return this.form.get('minSdkVersion');
  }

  get targetSdkControl() {
    return this.form.get('targetSdkVersion');
  }

  get notesControl() {
    return this.form.get('notes');
  }
}
