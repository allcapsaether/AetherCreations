import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { catalog, type Product } from "../data";

type Line = { id: number; qty: number };
type Action =
  | { type: "add"; id: number }
  | { type: "setQty"; id: number; qty: number }
  | { type: "remove"; id: number };

export type CartLine = { product: Product; qty: number };
type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
};

export const MAX_QTY = 9;
const STORAGE_KEY = "aether.cart.v1";

function reducer(state: Line[], action: Action): Line[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((line) => line.id === action.id);
      if (!existing) return [...state, { id: action.id, qty: 1 }];
      return state.map((line) => (line.id === action.id ? { ...line, qty: Math.min(line.qty + 1, MAX_QTY) } : line));
    }
    case "setQty":
      if (action.qty < 1) return state.filter((line) => line.id !== action.id);
      return state.map((line) => (line.id === action.id ? { ...line, qty: Math.min(action.qty, MAX_QTY) } : line));
    case "remove":
      return state.filter((line) => line.id !== action.id);
  }
}

/** Reads the saved cart, dropping anything malformed or no longer in the catalog. */
function load(): Line[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data.flatMap((item: unknown) => {
      const line = item as Partial<Line> | null;
      const valid =
        line !== null &&
        typeof line === "object" &&
        Number.isInteger(line.id) &&
        catalog.has(line.id as number) &&
        Number.isInteger(line.qty) &&
        (line.qty as number) >= 1;
      return valid ? [{ id: line.id as number, qty: Math.min(line.qty as number, MAX_QTY) }] : [];
    });
  } catch {
    return [];
  }
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [saved, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* Storage unavailable (private mode, quota): the cart still works in memory. */
    }
  }, [saved]);

  const value = useMemo<CartValue>(() => {
    // Prices always come from the catalog, never from storage.
    const lines = saved.flatMap((line) => {
      const product = catalog.get(line.id);
      return product ? [{ product, qty: line.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.qty * line.product.price, 0),
      add: (product) => dispatch({ type: "add", id: product.id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
    };
  }, [saved]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}
