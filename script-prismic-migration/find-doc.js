// find-doc.js
//
// The Migration API says a document of a given (non-repeatable) type
// already exists, but it's not showing up as Live or in the Migration
// Releases tab. This script checks every active release/ref in the repo
// directly, to find exactly where it's actually sitting.
//
// Usage:
//   TYPE=articlelandingpage node find-doc.js

import "dotenv/config";
import * as prismic from "@prismicio/client";

const TYPE = process.env.TYPE;
if (!TYPE) {
  console.error("Usage: TYPE=<custom_type> node find-doc.js");
  process.exit(1);
}

const client = prismic.createClient(process.env.NEW_REPO, {
  accessToken: process.env.NEW_REPO_ACCESS_TOKEN,
});

async function main() {
  // Check master (published) content first, for completeness
  console.log(`Checking master (published) content for "${TYPE}"...`);
  const published = await client.getAllByType(TYPE).catch(() => []);
  console.log(`  found: ${published.length}`);
  published.forEach((d) => console.log(`    - ${d.uid || d.id} (${d.id})`));

  // Now check every active release/ref — this covers Migration Releases,
  // Planned releases, and anything else not yet published
  const releases = await client.getReleases();
  console.log(`\nFound ${releases.length} active release/ref(s) in "${process.env.NEW_REPO}":`);

  for (const release of releases) {
    console.log(`\n- "${release.label}" (id: ${release.id}, master: ${release.isMasterRef})`);
    if (release.isMasterRef) continue; // already checked above

    try {
      const docsInRelease = await client.queryContentFromRef(release.ref).getAllByType(TYPE);
      console.log(`    ${TYPE} documents in this release: ${docsInRelease.length}`);
      docsInRelease.forEach((d) => console.log(`      - ${d.uid || d.id} (${d.id})`));
    } catch (e) {
      console.log(`    (could not query this release: ${e.message})`);
    }
  }
}

main().catch((err) => {
  console.error("Search failed:", err);
  process.exit(1);
});
