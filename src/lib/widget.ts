/** Uniform JSON responses for the dashboard/spotify widget endpoints. */

export function unconfigured(reason: string) {
  return Response.json({ configured: false, reason }, { status: 200 });
}

export function cached(data: unknown, seconds: number) {
  return Response.json(data, {
    status: 200,
    headers: { "cache-control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds / 2}` },
  });
}

export function upstreamFailed(service: string, status: number) {
  return Response.json(
    { configured: false, reason: `${service} responded with ${status}.` },
    { status: 200 },
  );
}
