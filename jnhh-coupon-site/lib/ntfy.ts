/**
 * Sends a plain-text push notification to the configured ntfy.sh topic.
 *
 * ntfy.sh is a free push-notification service (no account required for
 * public topics). Set NTFY_TOPIC in your environment to a hard-to-guess,
 * private topic name — anyone who knows the topic name can read the
 * messages, so treat it like a secret.
 *
 * See: https://ntfy.sh/ and .env.example in the project root.
 */
export async function notify(message: string, title?: string) {
  const topic = process.env.NTFY_TOPIC;

  if (!topic || topic === "REPLACE_WITH_MY_PRIVATE_TOPIC") {
    // Don't throw in production — just log, so a missing/placeholder topic
    // doesn't take down the webhook endpoint. Swap the placeholder before
    // going live so notifications actually deliver.
    console.warn(
      "[ntfy] NTFY_TOPIC is not set (or still the placeholder). Skipping notification:",
      message
    );
    return { skipped: true };
  }

  const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: "POST",
    body: message,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(title ? { Title: title } : {}),
    },
  });

  if (!res.ok) {
    console.error("[ntfy] Failed to send notification", res.status, await res.text());
  }

  return { skipped: false, ok: res.ok };
}
