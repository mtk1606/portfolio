import handler from "vinext/server/fetch-handler";

// Cloudflare production entrypoint. This bypasses the OpenAI Sites connector
// wrapper so the deployed Worker has no dependency on the Sites runtime.
export default {
  fetch: handler.fetch,
};
