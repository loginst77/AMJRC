// audit.js
//
// Compares document counts per custom type between the OLD and NEW repo,
// straight from the Content API — no dashboard clicking required.
// Run this from inside script-prismic-migration/ (same place as migrate.js).

import "dotenv/config";
import * as prismic from "@prismicio/client";

const oldClient = prismic.createClient(process.env.OLD_REPO, {
  accessToken: process.env.OLD_REPO_ACCESS_TOKEN,
});

const newClient = prismic.createClient(process.env.NEW_REPO, {
  accessToken: process.env.NEW_REPO_ACCESS_TOKEN, // add this to .env if amjrc is private
});

async function main() {
  const oldRepoInfo = await oldClient.getRepository();
  const types = Object.keys(oldRepoInfo.types);

  console.log(`Comparing ${types.length} type(s) between "${process.env.OLD_REPO}" and "${process.env.NEW_REPO}"\n`);
  console.log("type".padEnd(24) + "old".padEnd(8) + "new".padEnd(8) + "status");
  console.log("-".repeat(60));

  for (const type of types) {
    let oldDocs = [];
    let newDocs = [];

    try {
      oldDocs = await oldClient.getAllByType(type, { lang: "*" });
    } catch (e) {
      // type might not exist / no access — treat as 0
    }

    try {
      newDocs = await newClient.getAllByType(type, { lang: "*" });
    } catch (e) {
      // type might not exist yet in new repo — treat as 0
    }

    const oldCount = oldDocs.length;
    const newCount = newDocs.length;
    const status = oldCount === newCount ? "OK" : "MISMATCH";

    console.log(type.padEnd(24) + String(oldCount).padEnd(8) + String(newCount).padEnd(8) + status);

    if (status === "MISMATCH") {
      const oldUIDs = new Set(oldDocs.map((d) => d.uid || d.id));
      const newUIDs = new Set(newDocs.map((d) => d.uid || d.id));
      const missing = [...oldUIDs].filter((uid) => !newUIDs.has(uid));
      if (missing.length) {
        console.log(`    missing in new: ${missing.join(", ")}`);
      }
    }
  }
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
