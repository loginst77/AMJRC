import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";

export const linkResolver: prismic.LinkResolverFunction = (doc) => {
  switch (doc.type) {
    case "home":
      return "/";
    case "landingpage":
      return `/${doc.uid}`;
    case "articlelandingpage":
      return "/media/articles";
    case "article":
      return `/media/articles/${doc.uid}`;
    case "videolandingpage":
      return "/media/videos";
    case "video":
      return `/media/videos/${doc.uid}`;
    case "podcastlandingpage":
      return "/media/podcasts";
    case "newspaperlandingpage":
      return "/media/newspaper";
    case "newspaper":
      return "/media/newspaper";
    default:
      return doc.uid ? `/${doc.uid}` : "/";
  }
};

/**
 * The project's Prismic repository name.
 */
export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers. This list determines a Prismic document's URL.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "home", path: "/" },
  { type: "landingpage", path: "/:uid" },
  { type: "articlelandingpage", path: "/media/articles" },
  { type: "article", path: "/media/articles/:uid" },
  { type: "videolandingpage", path: "/media/videos" },
  { type: "navigation", path: "/" },
  { type: "podcastlandingpage", path: "/media/podcasts" },
  { type: "newspaperlandingpage", path: "/media/newspaper" },
  { type: "newspaper", path: "/media/newspaper" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions: process.env.NODE_ENV === "production" ? { next: { tags: ["prismic"] }, cache: "force-cache" } : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({ client });

  return client;
};
