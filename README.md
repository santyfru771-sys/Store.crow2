# VULPES - Tienda simple

Proyecto scaffold de una tienda simple usando Next.js 14 (App Router), Tailwind CSS y Firebase (Firestore, Storage, Auth).

Características:
- Catálogo público con productos cargados en Firestore (colección `productos`), solo `activo: true` visibles.
- Página de producto con botón "Comprar por WhatsApp" que abre un mensaje pre-armado.
- Panel `/admin` protegido por Firebase Auth (email/password) donde se puede crear, ocultar/mostrar y eliminar productos.

Variables de entorno (crear `.env.local` en la raíz):

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_WHATSAPP_NUMBER  (ej: 5491123456789)

Pasos para configurar Firebase:
1. Crear un proyecto en https://console.firebase.google.com/
2. Habilitar Authentication > Sign-in method > Email/Password.
3. Crear una base de datos Firestore en modo de producción o prueba.
4. Habilitar Storage y configurar reglas según necesites.
5. En settings > Project settings > "Your apps" > add web app y copiar las credenciales para completar las variables de entorno.

Despliegue en Vercel:
1. Conectar el repo en Vercel.
2. Añadir las variables de entorno listadas arriba en Settings > Environment Variables.
3. Hacer deploy.

Notas:
- La app está pensada para uso sencillo y administración sin tocar código. Mantén segura la cuenta de administrador de Firebase.
- Realiza reglas de seguridad en Firestore y Storage antes de exponer la tienda en producción.
