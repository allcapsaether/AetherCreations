import { useEffect, useState, type ReactNode } from "react";
import { href, type Route } from "../router";
import { useCart } from "../state/cart";
import { useSession } from "../state/session";
import { Bag } from "./Icons";
import Mark from "./Mark";

function NavLink({ to, route, children }: { to: Route; route: Route; children: ReactNode }) {
  return (
    <a href={href(to)} aria-current={route === to ? "page" : undefined}>
      {children}
    </a>
  );
}

export default function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { user } = useSession();

  // Transparent over the home hero, solid everywhere else and once scrolled.
  const solid = route !== "home" || scrolled || open;

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" data-solid={solid} data-open={open}>
      <div className="container header-bar">
        <a className="brand" href={href("home")} aria-label="AetherCreations home">
          <Mark />
          <span>AetherCreations</span>
        </a>

        <nav className="nav" aria-label="Main">
          <NavLink to="systems" route={route}>Systems</NavLink>
          <NavLink to="parts" route={route}>Parts</NavLink>
        </nav>

        <div className="header-actions">
          <a
            className="cart-link"
            href={href("cart")}
            aria-current={route === "cart" ? "page" : undefined}
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
          >
            <Bag />
            <span className="cart-link__label">Cart</span>
            {count > 0 && <span className="badge">{count}</span>}
          </a>
          <div className="auth-links">
            {user ? (
              <a className="btn btn--sm" href={href("account")}>Account</a>
            ) : (
              <>
                <a className="link-quiet" href={href("signin")}>Sign in</a>
                <a className="btn btn--sm" href={href("signup")}>Create account</a>
              </>
            )}
          </div>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav className="mobile-panel" id="mobile-nav" aria-label="Mobile" hidden={!open}>
        <NavLink to="systems" route={route}>Systems</NavLink>
        <NavLink to="parts" route={route}>Parts</NavLink>
        <NavLink to="cart" route={route}>Cart{count > 0 ? ` (${count})` : ""}</NavLink>
        {user ? (
          <NavLink to="account" route={route}>Account</NavLink>
        ) : (
          <>
            <NavLink to="signin" route={route}>Sign in</NavLink>
            <NavLink to="signup" route={route}>Create account</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
