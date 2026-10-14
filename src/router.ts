import { useEffect, useState } from "react";

/** Tiny hash router: "#/read/2" -> ["read", "2"]. */
export function useRoute(): string[] {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

export function go(path: string, opts: { replace?: boolean } = {}) {
  const hash = `#/${path.replace(/^\//, "")}`;
  if (opts.replace) window.location.replace(hash);
  else window.location.hash = hash;
}

export function back(fallback: string) {
  if (window.history.length > 1) window.history.back();
  else go(fallback);
}
