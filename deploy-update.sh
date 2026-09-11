#!/usr/bin/env bash
set -e

COMMIT_MESSAGE="${1:-Mise à jour Copilote Projet IA}"

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
git commit -m "$COMMIT_MESSAGE"
git push

echo "✓ Déploiement lancé (\"$COMMIT_MESSAGE\"). Suivez l'onglet Actions sur GitHub pour la mise en ligne."
