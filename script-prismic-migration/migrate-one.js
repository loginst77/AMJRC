// migrate-one.js
//
// Migrates exactly ONE document by type + UID. Useful when the rest of a
// type has already migrated successfully and re-running the whole type
// would conflict with docs that already exist in the new repo.
//
// Usage:
//   TYPE=landingpage DOC_UID=join-alliance node migrate-one.js
//
// NOTE: This uses DOC_UID rather than UID because UID is a reserved shell
// variable in zsh (it holds your macOS user ID), and trying to set it
// throws "failed to change user ID: operation not permitted".

import "dotenv/config";
import * as prismic from "@prismicio/client";

const TYPE = process.env.TYPE;
const DOC_UID = process.env.DOC_UID;

if (!TYPE || !DOC_UID) {
  console.error("Usage: TYPE=<custom_type> DOC_UID=<uid> node migrate-one.js");
  process.exit(1);
}

const readClient = prismic.createClient(process.env.OLD_REPO, {
  accessToken: process.env.OLD_REPO_ACCESS_TOKEN,
});

const writeClient = prismic.createWriteClient(process.env.NEW_REPO, {
  writeToken: process.env.NEW_REPO_WRITE_TOKEN,
});

async function main() {
  const doc = await readClient.getByUID(TYPE, DOC_UID, { lang: "*" });
  console.log(`Found "${DOC_UID}" (${TYPE}) in ${process.env.OLD_REPO}. Migrating...`);

  const migration = prismic.createMigration();
  let title = doc.uid || doc.id;
  if (doc.data?.title) {
    try {
      title = prismic.asText(doc.data.title) || title;
    } catch {
      // ignore
    }
  }
  migration.createDocumentFromPrismic(doc, title);

  await writeClient.migrate(migration, {
    reporter(event) {
      console.log(`  [${event.type}]`);
    },
  });

  console.log(`\nDone. Check ${process.env.NEW_REPO}'s Migration Releases tab.`);
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  if (err.response) {
    console.error("Full error details:", JSON.stringify(err.response, null, 2));
  }
  process.exit(1);
});
