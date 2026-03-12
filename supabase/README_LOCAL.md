# Supabase local — Base de test Compare.

## Prérequis

- **Docker Desktop** (ou OrbStack, Podman) — [Installation](https://docs.docker.com/desktop/)
- Lancez Docker avant de continuer

## Démarrage

```bash
# 1. Démarrer la stack Supabase (Postgres + API + Studio)
npx supabase start

# 2. Appliquer les migrations et charger les données de test
npx supabase db reset
```

Après `supabase start`, la sortie affiche les URLs et clés locales. Copiez-les dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key affiché par supabase start>
```

## Données de test (seed.sql)

- **Produit** : iPhone 13 (slug `apple-iphone-13`)
- **Offres neuf** : Amazon, Fnac
- **Offres occasion** : Back Market, Amazon Renewed
- **Offres pièces** : batterie-usee, ecran-casse, etc. (Amazon)

## Accès

- **Studio** (interface web) : http://127.0.0.1:54323
- **API** : http://127.0.0.1:54321

## Arrêter

```bash
npx supabase stop
```

## Basculer entre local et production

Pour utiliser la base locale, assurez-vous que `.env.local` pointe vers les URLs locales. Pour la production, utilisez les variables de votre projet Supabase cloud.
