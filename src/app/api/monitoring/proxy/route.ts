import { NextRequest, NextResponse } from 'next/server';

/**
 * Aegis Tactical Stream Proxy
 * Bypasses Mixed Content (HTTP on HTTPS) by fetching stream segments server-side.
 * This is required for Cloud Run production environments where MediaMTX is on a bare IP.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
};

function isAllowedTarget(url: string): boolean {
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('35.193.60.247')
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Target URL required', { status: 400 });
  }

  if (!isAllowedTarget(targetUrl)) {
    console.warn("[Proxy] Blocked unauthorized target:", targetUrl);
    return new NextResponse('Unauthorized target', { status: 403 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'AegisShield-Tactical-Proxy',
        'Accept': '*/*',
      },
      cache: targetUrl.endsWith('.m3u8') ? 'no-store' : 'default',
    });

    if (!res.ok) {
      console.error(`[Proxy] MediaMTX Target Failed: ${res.status} for ${targetUrl}`);
      return new NextResponse(`MediaMTX Target Failed: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';

    // Rewrite M3U8 manifest relative paths
    if (targetUrl.includes('.m3u8') || contentType.includes('mpegurl')) {
      const text = await res.text();
      const folderUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      const rewrittenText = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          if (trimmed.includes('://')) {
            if (trimmed.startsWith('http:')) {
              return `/api/monitoring/proxy?url=${encodeURIComponent(trimmed)}`;
            }
            return trimmed;
          }
          const absolute = new URL(trimmed, folderUrl).toString();
          return `/api/monitoring/proxy?url=${encodeURIComponent(absolute)}`;
        }
        return line;
      }).join('\n');

      return new NextResponse(rewrittenText, {
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      });
    }

    // Proxy binary segments (.ts) and other binary content
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': contentType || 'video/MP2T',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      }
    });

  } catch (err: any) {
    console.error("[Proxy Error]:", err.message);
    return new NextResponse(`Stream Proxy Error: ${err.message}`, { status: 500 });
  }
}

/**
 * POST proxy for WebRTC WHEP endpoint.
 * Forwards the SDP offer to MediaMTX and returns the SDP answer.
 * Note: ICE candidates still need direct UDP access to the media server.
 * For full WebRTC support, configure Caddy with a domain and use HTTPS URLs.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Target URL required', { status: 400 });
  }

  if (!isAllowedTarget(targetUrl)) {
    console.warn("[Proxy] Blocked unauthorized POST target:", targetUrl);
    return new NextResponse('Unauthorized target', { status: 403 });
  }

  try {
    const body = await req.text();
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/sdp',
        'User-Agent': 'AegisShield-Tactical-Proxy',
      },
      body,
    });

    const responseBody = await res.text();
    return new NextResponse(responseBody, {
      status: res.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': res.headers.get('content-type') || 'application/sdp',
      }
    });
  } catch (err: any) {
    console.error("[Proxy POST Error]:", err.message);
    return new NextResponse(`Stream Proxy Error: ${err.message}`, { status: 500 });
  }
}
