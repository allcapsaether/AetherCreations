import { useState, type FormEvent } from "react";
import { href } from "../router";
import { useToast } from "../state/toast";
import { ArrowRight } from "./Icons";
import Mark from "./Mark";

// Replace these with the studio's real profiles.
const social = [
  { label: "Instagram", url: "https://www.instagram.com/" },
  { label: "YouTube", url: "https://www.youtube.com/" },
  { label: "X / Twitter", url: "https://x.com/" },
];

export default function Footer() {
  const { notify } = useToast();
  const [email, setEmail] = useState("");

  const subscribe = (event: FormEvent) => {
    event.preventDefault();
    // TODO: send `email` to your mailing-list provider.
    notify("You're on the list. Notes from the studio will reach you occasionally.");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <div className="brand">
            <Mark />
            <span>AetherCreations</span>
          </div>
          <p>
            Computers of non-existent restraint.
            <br />
            Designed and built in Portland, Oregon.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2>Explore</h2>
          <ul>
            <li><a href={href("systems")}>Systems</a></li>
            <li><a href={href("parts")}>Parts</a></li>
            <li><a href={href("cart")}>Cart</a></li>
            <li><a href={href("account")}>Account</a></li>
          </ul>
        </nav>

        <div>
          <h2>Follow along</h2>
          <ul>
            {social.map((item) => (
              <li key={item.label}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label} <span className="visually-hidden">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="newsletter" onSubmit={subscribe}>
          <h2>Studio notes</h2>
          <label htmlFor="newsletter-email">Occasional updates on new builds and limited runs.</label>
          <div className="newsletter__row">
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowRight />
            </button>
          </div>
        </form>
      </div>

      <div className="container footer__legal">
        <small>© 2026 AetherCreations Systems, Inc.</small>
      </div>
      <div className="footer__word" aria-hidden="true">AetherCreations</div>
    </footer>
  );
}
