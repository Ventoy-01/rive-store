# RiveStore 🌸

## Boutique en ligne élégante pour vêtements, cosmétiques et accessoires

### 🚀 Installation

1. Cloner le projet
```bash
git clone <repo-url>
cd rivestore
Installer les dépendances

bash
npm install
Configurer les variables d'environnement

bash
cp .env.example .env
# Éditer .env avec vos credentials
Initialiser la base de données

bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
Lancer l'application

bash
npm run dev
🎨 Palette de couleurs
Beige rosé: #F7E9E6

Or pâle: #E6C8A0

Rose poudré: #D8A7B9

Vert sauge: #A3C4B5

📦 Technologies
Next.js 14

TypeScript

Prisma + MySQL

Tailwind CSS

NextAuth.js

Nodemailer

👩‍💻 Développement
bash
npm run db:studio  # Interface Prisma
npm run lint       # ESLint
npm run build      # Production build
