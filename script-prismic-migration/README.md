# Prismic repo migration: church-website → amjrc

Moves every document from the old repo into the new one, including images/PDFs,
using Prismic's own `createDocumentFromPrismic()` migration helper.

## Before you run this

1. **The new repo (`amjrc`) must already exist.**
2. **Custom types and slices must already be pushed to it** — via Slice Machine,
   pointed at `amjrc`, so the document shapes match. This script does NOT create
   custom types, only content.

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `NEW_REPO_WRITE_TOKEN` — from the **amjrc** repo's Settings > API & Security > Migration API token
- `OLD_REPO_ACCESS_TOKEN` — only if `church-website` is a private repository

## Test on one type first

Before migrating everything, run it against a single custom type to check the
result in the new repo's dashboard:

```bash
TYPES=blog_post node migrate.js
```

Check `amjrc`'s **Migration Releases** tab — confirm the content and images
came across correctly, then publish that batch (or discard it and adjust the
script if something's off).

## Run the full migration

```bash
npm run migrate
```

This will:
1. List every custom type in `church-website`
2. Pull every document (all locales) for each type
3. Re-upload any images/PDFs into `amjrc`'s media library
4. Push each document into `amjrc` as a draft in a Migration Release

## After it finishes

- Go to `amjrc` → **Migration Releases** tab
- Review the imported documents
- Click publish — this step can't be done via the API, it's a manual click by design

## Notes / limits

- Requests to Prismic's Migration API are limited to 1/second per repo — for a
  large number of documents this script will just take a while, that's expected.
- This only pulls **published** content from the old repo (Prismic's read API
  doesn't expose other people's drafts). If there's anything still in draft in
  `church-website` that you want kept, publish it there first.
- Re-running the script will create duplicate documents rather than update
  existing ones — this is meant to be a one-time move, not something to run twice.
