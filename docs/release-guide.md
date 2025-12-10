# Guía de publicación (Android, iOS y web móvil)

Esta guía resume los pasos para preparar artefactos de publicación y firmarlos con una key generada a medida.

## 1. Preparar plataformas y dependencias
1. Instala las plataformas nativas cuando corresponda:
   ```bash
   npx cap add android
   npx cap add ios
   ```
2. Sincroniza el proyecto tras cada cambio en `capacitor.config.ts` o `config.xml`:
   ```bash
   npm run build
   npx cap sync
   ```

## 2. Generar artefactos Android (APK sin firmar y App Bundle)
1. Abre el proyecto Android:
   ```bash
   npx cap open android
   ```
2. Desde Android Studio o la CLI de Gradle, genera el APK sin firmar listo para firma externa:
   ```bash
   ./gradlew assembleRelease
   ```
   El APK sin firmar se almacena en `android/app/build/outputs/apk/release/`.
3. Para el App Bundle (.aab) ejecuta:
   ```bash
   ./gradlew bundleRelease
   ```
   El bundle se guarda en `android/app/build/outputs/bundle/release/`.

## 3. Generar artefacto iOS
1. Abre el workspace de Xcode:
   ```bash
   npx cap open ios
   ```
2. Selecciona el esquema `App` y ejecuta *Product > Archive* para crear el archivo `.xcarchive` destinado a App Store Connect.

## 4. Generar key con Keytool
Ejecuta el siguiente comando ajustando el nombre, la validez y los datos del cliente:
```bash
keytool -genkey -v \
  -keystore ecolista-release.keystore \
  -alias ecolista-publisher \
  -keyalg RSA \
  -keysize 2048 \
  -validity 3650 \
  -storepass "CLAVE_DEL_CLIENTE" \
  -keypass "CLAVE_DEL_CLIENTE" \
  -dname "CN=EcoLista, OU=Móvil, O=EcoLista, L=Santiago, ST=RM, C=CL"
```

## 5. Firmar el APK o App Bundle
1. Firma el APK generado usando `apksigner` (incluido en el SDK de Android):
   ```bash
   $ANDROID_HOME/build-tools/<version>/apksigner sign \
     --ks ecolista-release.keystore \
     --ks-key-alias ecolista-publisher \
     --ks-pass pass:CLAVE_DEL_CLIENTE \
     --key-pass pass:CLAVE_DEL_CLIENTE \
     --out app-release-signed.apk \
     android/app/build/outputs/apk/release/app-release-unsigned.apk
   ```
2. Para el App Bundle, firma con `jarsigner`:
   ```bash
   jarsigner \
     -verbose \
     -sigalg SHA256withRSA \
     -digestalg SHA-256 \
     -keystore ecolista-release.keystore \
     android/app/build/outputs/bundle/release/app-release.aab \
     ecolista-publisher
   ```
3. Verifica la firma:
   ```bash
   $ANDROID_HOME/build-tools/<version>/apksigner verify --print-certs app-release-signed.apk
   ```

## 6. Checklist de validación previa a publicación
- [ ] `config.xml` con `id`, `name`, `version`, `AndroidMinSdkVersion` y `android-targetSdkVersion` actualizados.
- [ ] `capacitor.config.ts` sincronizado y `npx cap sync` ejecutado.
- [ ] Formularios de publicación completados y capturas adjuntas.
- [ ] APK sin firmar y App Bundle generados en modo `release`.
- [ ] Firma aplicada con la key de cliente y verificada con `apksigner verify`.
- [ ] Notas de revisión y contacto del desarrollador (`publicaciones@ecolista.app`) incluidas en la ficha de la tienda.

## 7. Distribución web móvil (PWA)
Ejecuta un build de producción y sirve el contenido de `www/`:
```bash
npm run build -- --configuration production
```
Sube la carpeta `www/` a tu hosting o CDN favorito.
