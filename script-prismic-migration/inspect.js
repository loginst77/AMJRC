const client = prismic.createClient(process.env.NEW_REPO, {
  accessToken: process.env.NEW_REPO_ACCESS_TOKEN, // add this to .env if amjrc is private
});
const docs = await client.getAllByType("tag");
console.log(JSON.stringify(docs[0], null, 2));
