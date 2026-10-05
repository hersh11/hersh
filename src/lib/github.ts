/**
 * Every GitHub REST call goes through here so they share one auth story.
 *
 * Unauthenticated, GitHub allows 60 requests an hour per IP. That is plenty
 * behind the cache locally, but Vercel builds and functions run on IPs shared
 * with other customers, so the budget can already be spent when the home page
 * builds - and a failed fetch there gets cached for the whole revalidate
 * window. GITHUB_TOKEN is optional; with one, the limit is 5,000 an hour.
 */
export function githubFetch(path: string, revalidate: number) {
  const token = process.env.GITHUB_TOKEN;
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate },
  });
}
