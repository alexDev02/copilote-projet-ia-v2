#!/usr/bin/env bash
set -e

mkdir -p public/fonts

echo "→ Téléchargement de la police Inter (variable, latin, graisses 100-900)..."
curl -fL "https://cdn.jsdelivr.net/npm/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2" \
  -o public/fonts/Inter-Variable.woff2

echo "✓ Police installée dans public/fonts/Inter-Variable.woff2"
echo "  Elle sera servie depuis votre propre domaine GitHub Pages (self-hosted), sans dépendance à un CDN externe au runtime."
