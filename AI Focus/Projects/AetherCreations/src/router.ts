import { useSyncExternalStore } from "react";

/**
 * Tiny hash router: every page gets a real URL (#/systems), the back button
 * works, and pages can be linked to, with no extra dependency.
 */
export type Route = "home" | "systems" | "parts" | "cart" | "account" | "signin" | "signup";

export const routePaths: Record<Route, string> = {
  home: "/",
  systems: "/systems",
  parts: "/parts",
  cart: "/cart",
  account: "/account",
  signin: "/sign-in",
  signup: "/sign-up",
};

export const routeTitles: Record<Route, string> = {
  home: "Home",
  systems: "Prebuilt systems",
  parts: "Computer parts",
  cart: "Cart",
  account: "Account",
  signin: "Sign in",
  signup: "Create account",
};

export const href = (route: Route) => `#${routePaths[route]}`;

export const navigate = (route: Route) => {
  window.location.hash = routePaths[route];
};

const routes = Object.keys(routePaths) as Route[];
let current: Route = "home";

function read(): Route {
  const hash = window.location.hash;
  if (hash === "" || hash === "#") return (current = "home");
  // In-page anchors such as "#main" or "#root" (skip links) are not routes.
  if (!hash.startsWith("#/")) return current;
  const path = hash.slice(1);
  return (current = routes.find((route) => routePaths[route] === path) ?? "home");
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, read, () => "home");
}
