#!/usr/bin/env bash
set -e

echo "→ Installation des dépendances..."
npm install

echo "→ Vérification TypeScript..."
npm run typecheck

echo "→ Formatage (Prettier)..."
npm run format:write

echo "→ Build de production..."
npm run build

echo "→ Commit et push..."
git add -A
git commit -m "Lot 1+2 : socle + moteur workflow + workflow COPIL complet"
git push

echo "✓ Déploiement lancé. Suivez l'onglet Actions sur GitHub pour la mise en ligne."
