import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = process.env.BACKEND_BASE;
if (!BACKEND_BASE) {
  console.warn("[backend proxy] BACKEND_BASE is not set");
}

function buildTarget(req: NextRequest, segs: string[]) {
  if (!BACKEND_BASE) throw new Error("BACKEND_BASE is not set");
  const base = BACKEND_BASE.replace(/\/+$/, "");
  const path = segs.join("/");
  const qs = req.nextUrl.search || "";
  return `${base}/${path}${qs}`;
}

async function forward(req: NextRequest, segs: string[]) {
  const target = buildTarget(req, segs);

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    cache: "no-store",
  };

  const res = await fetch(target, init);
  const buf = await res.arrayBuffer();

  const outHeaders = new Headers();
  const contentType = res.headers.get("content-type") ?? "application/json; charset=utf-8";
  outHeaders.set("content-type", contentType);
  const cacheControl = res.headers.get("cache-control");
  if (cacheControl) outHeaders.set("cache-control", cacheControl);

  return new NextResponse(buf, { status: res.status, headers: outHeaders });
}

type Ctx = { params: Promise<{ all: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function HEAD(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  const { all } = await ctx.params;
  return forward(req, all);
}
