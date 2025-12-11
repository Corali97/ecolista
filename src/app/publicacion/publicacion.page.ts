<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
  PLATFORM_CONFIG_TOKEN,
  PlatformConfig,
  resolvePlatformConfig,
  resolvePlatformTarget,
} from '../config/platform-config';
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DEFAULT_PLATFORM_CONFIG, PlatformConfig } from '../config/platform-config';
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
})
export class PublicacionPage implements OnInit {
  readonly detectedPlatform = resolvePlatformTarget();
  readonly platformConfig: PlatformConfig;

  readonly form = this.fb.nonNullable.group({
    packageId: [this.platformConfig.packageId, [Validators.required, Validators.pattern(/[a-zA-Z]+(\.[a-zA-Z0-9_]+)+/)]],
    appName: [this.platformConfig.appName, [Validators.required, Validators.minLength(3)]],
    versionName: ['1.0.0', [Validators.required, Validators.pattern(/^[0-9]+\.[0-9]+\.[0-9]+$/)]],
    versionCode: [1, [Validators.required, Validators.min(1)]],
    developerEmail: [this.platformConfig.developerEmail, [Validators.required, Validators.email]],
    minSdkVersion: [this.platformConfig.minSdkVersion, [Validators.required, Validators.min(21)]],
    targetSdkVersion: [this.platformConfig.targetSdkVersion, [Validators.required, Validators.min(21)]],
    buildType: ['apk', Validators.required],
    notes: [this.platformConfig.notes, [Validators.required, Validators.minLength(8)]],
  });

  submissionPreview?: PlatformConfig;

  constructor(
    @Inject(FormBuilder) private readonly fb: FormBuilder,
    @Inject(PLATFORM_CONFIG_TOKEN) platformConfig?: PlatformConfig,
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
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class PublicacionPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly platformConfig: PlatformConfig = { ...DEFAULT_PLATFORM_CONFIG };

  readonly publicationForm = this.formBuilder.nonNullable.group({
    packageId: [this.platformConfig.packageId, [Validators.required, Validators.pattern(/[a-zA-Z]+(\.[a-zA-Z0-9_]+)+/)]],
    appName: [this.platformConfig.appName, [Validators.required, Validators.minLength(3)]],
    developerEmail: [this.platformConfig.developerEmail, [Validators.required, Validators.email]],
    minSdkVersion: [this.platformConfig.minSdkVersion, [Validators.required, Validators.min(21)]],
    targetSdkVersion: [this.platformConfig.targetSdkVersion, [Validators.required, Validators.min(21)]],
    notes: [this.platformConfig.notes, [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.publicationForm.invalid) {
      this.publicationForm.markAllAsTouched();
      return;
    }

    const payload = this.publicationForm.getRawValue();
    console.info('Publication payload ready to send', payload);
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
  }
}
