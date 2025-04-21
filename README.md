# Générateur de CV

Une application professionnelle basée sur Next.js 15 qui permet aux utilisateurs de construire efficacement des CV structurés via une interface intuitive de blocs modulaires.

## Présentation

Cette application offre une solution moderne pour la création de CV en permettant aux utilisateurs de définir précisément la structure de leur document et d'organiser leur contenu de manière flexible.

## Fonctionnalités

- **Interface par blocs** : Construction modulaire du CV avec des blocs personnalisables
- **Mise en page flexible** : Configuration ajustable de colonnes (1 à 3) et rangées
- **Blocs imbriqués** : Structures hiérarchiques pour une organisation optimale du contenu
- **Champs spécialisés** : Titres, plages de dates et autres composants dédiés
- **Responsive** : Interface adaptée à tous les appareils

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/generateur-cv.git
cd generateur-cv

# Installer les dépendances
npm install

# Lancer l'environnement de développement
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Technologies

- **Next.js 15** : Framework React avec rendu côté serveur
- **React 19** : Bibliothèque UI pour construire des interfaces utilisateur
- **TypeScript** : Pour un code typé et robuste
- **React Hook Form** : Gestion des formulaires avec validation
- **Tailwind CSS 4** : Styles utilitaires pour un design rapide et cohérent
- **Context API** : Gestion d'état globale pour les données du CV

## Utilisation

### Création d'un CV

1. Sélectionnez la structure de page (nombre de rangées)
2. Pour chaque rangée, définissez le nombre de colonnes
3. Ajoutez des blocs dans chaque colonne
4. Ajoutez des composants (titres, dates, etc.) à vos blocs
5. Complétez les informations demandées
6. Enregistrez votre mise en page

## Développement

### Commandes disponibles

```bash
# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en mode production
npm run start

# Linter
npm run lint
```

### Extension du projet

Pour ajouter un nouveau type de champ au générateur :

1. Créez un composant dans `components/cv/inputs`
2. Définissez l'interface dans `types/cv.ts`
3. Mettez à jour l'enum `ComponentType` dans `types/cv.ts`
4. Intégrez le composant dans `cvFormColumnBlock.tsx`

## Licence

[MIT](LICENSE)

## Contributions

Ce projet est ouvert aux contributions. Veuillez consulter les directives de contribution avant de soumettre des pull requests.

---

Développé avec Next.js 15 et React 19