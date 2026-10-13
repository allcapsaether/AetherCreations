import { useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Catalog from "./pages/Catalog";
import Home from "./pages/Home";
import { routeTitles, useRoute, type Route } from "./router";
import { CartProvider } from "./state/cart";
import { SessionProvider } from "./state/session";
import { ToastProvider } from "./state/toast";

function Page({ route }: { route: Route }) {
  switch (route) {
    case "home":
      return <Home />;
    case "systems":
      return <Catalog kind="systems" />;
    case "parts":
      return <Catalog kind="parts" />;
    case "cart":
      return <Cart />;
    case "account":
      return <Account />;
    case "signin":
      return <Auth mode="signin" />;
    case "signup":
      return <Auth mode="signup" />;
  }
}

function Shell() {
  const route = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const previous = useRef(route);

  useEffect(() => {
    document.title =
      route === "home"
        ? "AetherCreations: computers of non-existent restraint"
        : `${routeTitles[route]} | AetherCreations`;

    // On navigation, start at the top and move focus to the new page so
    // keyboard and screen-reader users aren't left in the old one.
    if (previous.current !== route) {
      previous.current = route;
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [route]);

  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" ref={mainRef} tabIndex={-1}>
        {/* Keyed so form and sort state reset when the page changes. */}
        <Page key={route} route={route} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SessionProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </SessionProvider>
    </ToastProvider>
  );
}
