import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  // Responses are cached by Next ('use cache' + webhook revalidation), so read straight from the API.
  useCdn: false,
  perspective: "published",
});
