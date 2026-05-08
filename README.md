# DNOSP / EDU-NC - Plateforme d'Aide à la Décision Pédagogique

Cette plateforme est un outil ERP institutionnel conçu pour la **Direction Nationale d’Orientation Scolaire et Professionnelle (DNOSP)**. Elle permet d'enregistrer, de suivre et d'analyser les résultats des élèves de la 1ère à la 4ème Humanité Pédagogique Rénovée (HPR).

## 🚀 Fonctionnalités Clés

- **Authentification Sécurisée** : Accès restreint par rôles (Administrateur vs Conseiller).
- **Tableau de Bord ERP** : Vue d'ensemble interactive et responsive.
- **Importation Excel** : Intégration massive de données d'élèves en un clic.
- **Matrice de Suivi** : Classification automatique des élèves selon 4 profils stratégiques et recommandations pédagogiques personnalisées.
- **Statistiques & Graphiques** : Analyse visuelle par province et au niveau national pour dégager des conclusions stratégiques.
- **Gestion Administrative** : Création de comptes utilisateurs et suppression sécurisée d'élèves.

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS & Lucide React
- **Base de données** : SQLite avec [Prisma ORM](https://www.prisma.io/)
- **Authentification** : NextAuth.js
- **Graphiques** : Recharts

## 📦 Installation et Configuration

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/votre-compte/dnosp-platform.git
   cd dnosp-platform
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   - Renommez `.env.example` en `.env`.
   - Modifiez `NEXTAUTH_SECRET` par une clé sécurisée.

4. **Initialiser la base de données** :
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🔐 Identifiants par défaut (Seed)

- **Administrateur Principal** :
  - Email : `admin@plateforme.cd`
  - Mot de passe : `admin123`
- **Utilisateur Provincial** :
  - Email : `user@kinshasa.cd`
  - Mot de passe : `user123`

## 📂 Structure du Projet

- `/src/app` : Routes et pages de l'application.
- `/src/components` : Composants UI réutilisables (Sidebar, Modales, Graphiques).
- `/src/lib` : Logique métier (Auth, Prisma, Recommandations).
- `/prisma` : Schéma de base de données et scripts de seed.
- `/public` : Assets statiques (Logos, Photos).

---
© 2026 DNOSP / EDU-NC. Tous droits réservés.
