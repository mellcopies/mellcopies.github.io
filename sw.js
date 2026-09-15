var l = ["./assets/index-CUcDGYd3.js", "./assets/style-DA4U_P7E.css", "./favicon.svg", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./index.html", "./manifest.webmanifest"];
const c = self, u = "0.1.4-4b59a4afae", h = `mell-shell-${u}`, f = "mell-library-v1", d = "mell-thumbs-v1", p = 2e3, m = typeof l < "u" ? l : ["./", "./index.html"], w = new URL("./", c.location.href).pathname;
c.addEventListener("install", (t) => {
  t.waitUntil((async () => {
    const e = await caches.open(h);
    await Promise.all(m.map((n) => e.add(new Request(n, { cache: "reload" })).catch(() => {
    }))), await c.skipWaiting();
  })());
});
c.addEventListener("activate", (t) => {
  t.waitUntil((async () => {
    const e = await caches.keys();
    await Promise.all(e.filter((n) => n.startsWith("mell-shell-") && n !== h).map((n) => caches.delete(n))), await c.clients.claim();
  })());
});
c.addEventListener("message", (t) => {
  t.data === "skipWaiting" && c.skipWaiting();
});
function v(t) {
  return t.pathname.includes("/storage/v1/object/sign/") || t.pathname.includes("/storage/v1/object/upload/sign/") || t.searchParams.has("token");
}
function g(t) {
  return t.origin === c.location.origin && t.pathname.startsWith(w);
}
function y(t) {
  return t.pathname.includes("/mell-proxy") || t.pathname.includes("/functions/v1/");
}
function b(t) {
  return /\/index(\.meta)?\.json$/.test(t.pathname) && /library/.test(t.pathname);
}
function E(t) {
  return /\/(thumbs|previews)\/\d+\.webp$/.test(t.pathname);
}
function r(t) {
  return t.ok ? !/\bno-store\b/i.test(t.headers.get("cache-control") || "") : !1;
}
async function L(t, e) {
  const n = await caches.open(t), a = await n.keys();
  a.length <= e || await Promise.all(a.slice(0, a.length - e).map((s) => n.delete(s)));
}
c.addEventListener("fetch", (t) => {
  const e = t.request;
  if (e.method !== "GET") return;
  const n = new URL(e.url);
  if (!v(n)) {
    if (g(n)) {
      t.respondWith((async () => {
        const a = await caches.open(h), s = await a.match(e, { ignoreSearch: !0 });
        if (s) return s;
        try {
          const i = await fetch(e);
          return r(i) && (n.pathname.includes("/assets/") || n.pathname.endsWith(".png") || n.pathname.endsWith(".svg")) && a.put(e, i.clone()), i;
        } catch {
          if (e.mode === "navigate") {
            const i = await a.match("./index.html");
            if (i) return i;
          }
          return new Response("offline", { status: 503, headers: { "content-type": "text/plain" } });
        }
      })());
      return;
    }
    if (!y(n)) {
      if (b(n)) {
        t.respondWith((async () => {
          const a = await caches.open(f), s = fetch(e).then((o) => (r(o) && a.put(e, o.clone()), o)).catch(() => {
          });
          if (e.cache === "no-cache" || e.cache === "reload") {
            const o = await s;
            if (o) return o;
          }
          const i = await a.match(e);
          return i || (await s ?? new Response("offline", { status: 503 }));
        })());
        return;
      }
      E(n) && t.respondWith((async () => {
        const a = await caches.open(d), s = await a.match(e);
        if (s) return s;
        try {
          const i = await fetch(e);
          return r(i) && (a.put(e, i.clone()), L(d, p)), i;
        } catch {
          return new Response("", { status: 503 });
        }
      })());
    }
  }
});
