// inspect-new.js
//
// Prints the raw API response for documents of a given type in the NEW
// repo (amjrc), so we can see the actual `data` object — not the
// dashboard's rendering of it.
//
// Usage:
//   TYPE=landingpage node inspect-new.js
//   TYPE=landingpage UID=some-uid node inspect-new.js   (to check one specific doc)

import "dotenv/config";
import * as prismic from "@prismicio/client";

const TYPE = process.env.TYPE;
const UID = process.env.UID;
const RELEASE_LABEL = process.env.RELEASE; // optional: check inside an unpublished release instead of master

if (!TYPE) {
  console.error("Usage: TYPE=<custom_type> [UID=<uid>] [RELEASE=<release_label>] node inspect-new.js");
  process.exit(1);
}

const client = prismic.createClient(process.env.NEW_REPO, {
  accessToken: process.env.NEW_REPO_ACCESS_TOKEN,
});

async function main() {
  if (RELEASE_LABEL) {
    const release = await client.getRefByLabel(RELEASE_LABEL);
    client.queryContentFromRef(release.ref);
    console.log(`Checking inside release "${RELEASE_LABEL}"...\n`);
  }

  if (UID) {
    const doc = await client.getByUID(TYPE, UID, { lang: "*" });
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  const docs = await client.getAllByType(TYPE, { lang: "*" });
  console.log(`Found ${docs.length} "${TYPE}" document(s) in ${process.env.NEW_REPO}.\n`);
  for (const doc of docs) {
    console.log(`--- ${doc.uid || doc.id} ---`);
    console.log(JSON.stringify(doc.data, null, 2));
    console.log();
  }
}

main().catch((err) => {
  console.error("Inspect failed:", err);
  process.exit(1);
});
