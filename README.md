# ⭐ Starlike – Règlement & Admin Panel

Site web statique affichant un règlement public avec une **interface d’administration sécurisée** permettant de modifier le contenu.

Construit avec Vite et déployé sur Vercel via des fonctions serverless.

---

## 🇫🇷 Français

### 🚀 Fonctionnalités

#### ✅ Public
- Affichage du règlement
- Chargement dynamique des règles via API
- Site statique rapide

#### 🔐 Administration
- Accès admin protégé par mot de passe
- Modification du règlement
- Sécurité côté serveur
- Aucune donnée sensible exposée côté client

---

### 🧱 Stack technique

- **Frontend** : Vite + JavaScript
- **Backend** : Vercel Serverless Functions
- **Hébergement** : Vercel
- **Sécurité** : Variables d’environnement

---

### 📁 Structure du projet

starlike-reglement/
├── api/
│ ├── login.js # Authentification admin
│ └── rules.js # Lecture / écriture du règlement
├── src/
│ ├── App.jsx
│ └── ...
├── index.html
├── package.json
└── README.md

---

### 🔑 Variables d’environnement

Le mot de passe admin est stocké de manière sécurisée via une variable d’environnement.

| Clé | Description |
|---|---|
| `ADMIN_PASSWORD` | Mot de passe d’accès admin |

⚠️ Ne jamais stocker le mot de passe directement dans le code.

---

### 🔐 Authentification admin (technique)

- Le mot de passe est envoyé via un header HTTP personnalisé
- Comparaison côté serveur avec `process.env.ADMIN_PASSWORD`
- Authentification entièrement côté serveur

---

### ▶️ Lancer le projet en local

npm install
npm run dev

⚠️ Pour l’accès admin en local, la variable ADMIN_PASSWORD doit être définie.

🌍 Déploiement
La branche principale est utilisée pour la production
Les autres branches sont déployées en preview
Toujours tester l’accès admin sur le déploiement de production
Un redeploy est nécessaire après toute modification des variables d’environnement

✅ Bonnes pratiques
Ne pas utiliser les URLs de preview pour l’admin
Redeployer après modification des variables d’environnement
Supprimer les logs de debug avant la production

🧠 Améliorations possibles
Sessions admin avec expiration
Plusieurs comptes administrateurs
Historique des modifications
Stockage en base de données
Gestion des rôles

📄 Licence
Projet privé / usage interne uniquement.

## 🇬🇧 English

### 🚀 Features

#### ✅ Public
Public rules display
Dynamic rules loading via API
Fast static website

#### 🔐 Admin
Password‑protected admin access
Rules editing
Server‑side security
No sensitive data exposed to the client

---

### 🧱 Tech Stack
Frontend: Vite + JavaScript
Backend: Vercel Serverless Functions
Hosting: Vercel
Security: Environment variables

### 📁 Project Structure

starlike-reglement/
├── api/
│   ├── login.js      # Admin authentication
│   └── rules.js      # Rules read/write API
├── src/
│   ├── App.jsx
│   └── ...
├── index.html
├── package.json
└── README.md

### 🔑 Environment Variables
The admin password is stored securely using an environment variable.

Key	Description
ADMIN_PASSWORD	Admin access password

⚠️ Never store the password directly in the code.

---

### 🔐 Admin Authentication (Technical Overview)

-The password is sent via a custom HTTP header
-Server‑side comparison with process.env.ADMIN_PASSWORD
-Authentication handled entirely on the server

---

### ▶️ Run Locally
bash
npm install
npm run dev

⚠️ For local admin access, the ADMIN_PASSWORD variable must be set.

🌍 Deployment
Main branch is used for production
Other branches are deployed as previews
Always test admin access on the production deployment
Redeploy required after environment variable updates

✅ Best Practices
Do not test admin access on preview deployments
Redeploy after environment variable changes
Remove debug logs before production

🧠 Possible Improvements
Admin sessions with expiration
Multiple admin accounts
Change history and audit logs
Database storage
Role‑based access control

📄 License
Private project / internal use only.
