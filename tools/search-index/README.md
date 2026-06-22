# Spac Sport Search Index Pipeline

Deze pipeline maakt buiten Divide en buiten de browser een voorbereid zoekbestand.
De zoekpagina hoeft dan geen 13 MB Channable-feed meer te parsen voordat producten zichtbaar worden.

## Bestanden

- `cloudflare-spac-search-index-worker.js` blijft de bron voor de omzetlogica.
- `tools/search-index/build-prepared-search-index.mjs` bouwt `dist/prepared.json`.
- `tools/search-index/upload-r2.mjs` kan `dist/prepared.json` naar Cloudflare R2 uploaden als R2 later wordt aangezet.
- `.github/workflows/search-index.yml` draait de build automatisch via GitHub Actions en publiceert `dist/prepared.json` via GitHub Pages.

## GitHub Pages

De standaard workflow heeft geen secrets nodig. Na een succesvolle run staat het bestand hier:

```text
https://spacsportstage-ship-it.github.io/spac-search-index/prepared.json
```

## Cloudflare R2 optioneel

Cloudflare R2 vraagt in dit account eerst om een R2 subscription. Zet deze secrets pas in GitHub als R2 bewust is aangezet:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

Optioneel:

- `R2_OBJECT_KEY`, standaard `prepared.json`
- `R2_PUBLIC_URL`, de publieke R2 URL zodat de workflow die netjes in de logs toont

## Lokaal testen

```bash
node tools/search-index/build-prepared-search-index.mjs
```

Met Cloudflare R2 credentials:

```bash
node tools/search-index/upload-r2.mjs
```

## Belangrijk

Plaats deze URL pas in Divide wanneer de publieke `prepared.json` URL live getest is.
