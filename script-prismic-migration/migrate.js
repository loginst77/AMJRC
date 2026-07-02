// migrate.js
//
// Migrates ALL documents (and their images/media) from one Prismic
// repository to another, using @prismicio/client v7's built-in
// createDocumentFromPrismic() helper — this is Prismic's own tool for
// duplicating pages across repos. It re-uploads assets and resolves
// content relationships automatically.
//
// Requirements:
//   - Node.js 20+ (needs global File/Blob/FormData)
//   - The NEW repo must already exist with matching custom types/slices
//     pushed to it (via Slice Machine) before you run this.
//
// Setup:
//   npm install
//   cp .env.example .env   (then fill in your values)
//
// Usage:
//   node migrate.js                        # migrate everything
//   TYPES=blog_post,page node migrate.js   # migrate only specific types
//                                            (do this first, on one type,
//                                             to sanity-check the result)

import "dotenv/config";
import * as prismic from "@prismicio/client";

// ---- CONFIG (reads from .env — see .env.example) ----
const OLD_REPO = process.env.OLD_REPO;
const NEW_REPO = process.env.NEW_REPO;
const NEW_REPO_WRITE_TOKEN = process.env.NEW_REPO_WRITE_TOKEN; // Migration API token from the NEW repo
const OLD_REPO_ACCESS_TOKEN = process.env.OLD_REPO_ACCESS_TOKEN || undefined; // only needed if OLD repo is private
const ONLY_TYPES = process.env.TYPES
  ? process.env.TYPES.split(",").map((t) => t.trim())
  : null; // optional filter, useful for a test run on one type first

if (!OLD_REPO || !NEW_REPO || !NEW_REPO_WRITE_TOKEN) {
  console.error(
    "Missing config. Make sure OLD_REPO, NEW_REPO, and NEW_REPO_WRITE_TOKEN are set in your .env file.\n" +
      "NEW_REPO_WRITE_TOKEN comes from the NEW repo's Settings > API & Security > Migration API token."
  );
  process.exit(1);
}

async function main() {
  const readClient = prismic.createClient(OLD_REPO, {
    accessToken: OLD_REPO_ACCESS_TOKEN,
  });

  const writeClient = prismic.createWriteClient(NEW_REPO, {
    writeToken: NEW_REPO_WRITE_TOKEN,
  });

  // Discover every custom type that actually has content in the old repo
  const repoInfo = await readClient.getRepository();
  const allTypes = Object.keys(repoInfo.types);
  const typesToMigrate = ONLY_TYPES ?? allTypes;

  console.log(`Found ${allTypes.length} custom type(s) in "${OLD_REPO}": ${allTypes.join(", ")}`);
  console.log(`Migrating: ${typesToMigrate.join(", ")}\n`);

  const migration = prismic.createMigration();

  let total = 0;
  for (const type of typesToMigrate) {
    // lang: "*" pulls every locale, not just the default one
    const docs = await readClient.getAllByType(type, { lang: "*" });
    console.log(`  ${type}: ${docs.length} document(s) found`);

    for (const doc of docs) {
      // Best-effort title for the Page Builder — falls back to the UID or ID
      // if the type doesn't have a "title" field.
      let title = doc.uid || doc.id;
      if (doc.data?.title) {
        try {
          title = prismic.asText(doc.data.title) || title;
        } catch {
          // ignore — not every "title" field is rich text
        }
      }

      migration.createDocumentFromPrismic(doc, title);
      total++;
    }
  }

  console.log(`\nQueued ${total} document(s) total. Uploading to "${NEW_REPO}"...\n`);

  await writeClient.migrate(migration, {
    reporter(event) {
      console.log(`  [${event.type}]`);
    },
  });

  console.log(
    `\nDone. ${total} document(s) were pushed as drafts.\n` +
      `Go to your "${NEW_REPO}" repo's Migration Releases tab to review and publish them.`
  );
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});
