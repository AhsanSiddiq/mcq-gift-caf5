import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// ISR pages are cached in Workers KV (R2 can replace it later); background revalidation runs through a Durable Object queue.
// No revalidateTag/revalidatePath is used, so no tag cache is needed.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: doQueue,
});
