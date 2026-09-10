# Copilote Projet IA

La méthode pour travailler avec l'IA quand on est chef de projet.

## Contenu de ce lot (Lot 1 + Lot 2)

- Socle applicatif : routing hash, layout, storage-service typé et validé, prompt-builder.
- Moteur de workflow générique (`workflow-engine.ts`) piloté par des données JSON.
- Écrans : Accueil (catalogue + recherche), Configuration du contexte projet, Workflow, Formation (placeholder).
- Un workflow complet livré comme preuve de bout en bout : **Préparer un COPIL** (8 étapes).
- Charte graphique "outil pro" appliquée (bleu `#0B3D91`, Inter, sobre).

## Démarrage (GitHub Codespaces)

```bash
npm install
npm run dev        # serveur de développement
npm run typecheck  # tsc --noEmit
npm run lint
npm run format      # vérifie le formatage
npm run format:write
npm run build       # build de production dans dist/
```

## Déploiement

Le déploiement utilise le mode natif **"GitHub Actions"** de GitHub Pages (pas de branche `gh-pages` à créer manuellement).

**Configuration à faire une seule fois sur GitHub.com (pas dans le Codespace) :**

1. Repo → **Settings → Pages** → section **Build and deployment → Source** → sélectionner **"GitHub Actions"** (et non "Deploy from a branch").
2. Si l'onglet **Actions** affiche un message du type *"Workflows aren't being run on this repository"*, cliquer sur **"I understand my workflows, go ahead and enable them"**.

Ensuite, chaque push sur `main` déclenche `.github/workflows/deploy.yml` : typecheck → lint → format → build → publication directe sur GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages`. L'URL de l'app apparaît dans l'onglet **Actions**, sur le job `deploy`, ou dans Settings → Pages une fois le premier déploiement terminé.

Le script `deploy-update.sh` enchaîne install, vérifications, build, commit et push.

## Police (Inter self-hostée)

La CSS référence `/fonts/Inter-Variable.woff2`. Pour respecter la CSP stricte (pas de police chargée depuis un CDN externe), téléchargez la variable font Inter et placez-la dans `public/fonts/Inter-Variable.woff2`. Tant que le fichier est absent, l'app utilise la pile de polices système en repli — aucun crash, juste un rendu légèrement différent.

## Ajouter un nouveau workflow

1. Créer un fichier JSON dans `src/data/workflows/<categorie>/<id>.json` en suivant la structure de `prepare-copil.json`.
2. L'importer et l'ajouter au tableau `WORKFLOWS` dans `src/data/workflow-repository.ts`.
3. Aucune autre modification de code n'est nécessaire — c'est la règle fondamentale du moteur : le code ne contient jamais la logique métier d'un workflow.

## Prochains lots prévus

- Lot 3 : Reporting, Analyser un risque, Préparer une réunion, Rédiger un compte rendu.
- Lot 4 : Module Formation (5 modules complets).
- Lot 5 : 10 workflows P1 complémentaires.
- Lot 6 : accessibilité, responsive avancé, tests.
