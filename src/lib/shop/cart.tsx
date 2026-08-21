import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Size } from "./catalog";

export type CartLine = { slug: string; size: Size; qty: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (slug: string, size: Size, qty?: number) => void;
  setQty: (slug: string, size: Size, qty: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
};

const KEY = "up:cart";
const CartContext = createContext<CartApi | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const api = useMemo<CartApi>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => {
      const p = getProduct(l.slug);
      return n + (p ? p.price * l.qty : 0);
    }, 0);
    return {
      lines,
      count,
      subtotal,
      add: (slug, size, qty = 1) => {
        setLines((prev) => {
          const i = prev.findIndex((l) => l.slug === slug && l.size === size);
          if (i >= 0) {
            const next = [...prev];
            const cur = next[i];
            if (cur) next[i] = { ...cur, qty: cur.qty + qty };
            return next;
          }
          return [...prev, { slug, size, qty }];
        });
      },
      setQty: (slug, size, qty) => {
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.slug === slug && l.size === size))
            : prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
        );
      },
      remove: (slug, size) => {
        setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
      },
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
