import Carousel from "../components/Carousel";
import { ArrowRight } from "../components/Icons";
import Photo from "../components/Photo";
import { parts, prebuilts } from "../data";
import { formatPrice } from "../lib";
import { href } from "../router";

const flagship = prebuilts[0];
const featuredParts = parts.slice(0, 3);

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span>Aether</span>
              <span>Creations</span>
            </h1>
            <p className="hero__lede">Computers of non-existent restraint.</p>
            <p className="hero__sub">Explore the vast sky. Discover true power.</p>
            <div className="hero__actions">
              <a className="btn btn--light btn--lg" href={href("systems")}>Shop systems</a>
              <a className="btn btn--outline btn--lg" href={href("parts")}>Shop parts</a>
            </div>
            <p className="hero__facts">
              An independent systems studio in Portland, Oregon. Established 2018, built in limited runs.
            </p>
          </div>

          <figure className="hero__window">
            <Photo
              photo={flagship.photo}
              alt={`${flagship.name}, our best-selling system`}
              widths={[600, 900, 1200]}
              sizes="(min-width: 900px) 420px, 90vw"
              priority
            />
            <a className="hero__chip" href={href("systems")}>
              <span>
                <strong>{flagship.name}</strong>
                <small>Best seller</small>
              </span>
              <span>From {formatPrice(flagship.price)}</span>
            </a>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Signature systems</h2>
            <a className="link-arrow" href={href("systems")}>
              View all systems <ArrowRight />
            </a>
          </div>
          <Carousel />
        </div>
      </section>

      <section className="manifesto">
        <div className="container manifesto__grid">
          <h2>Not another gaming PC company.</h2>
          <div className="manifesto__text">
            <p className="manifesto__lead">
              We build machines for people who obsess over the details, even the ones nobody else sees.
            </p>
            <p>
              AetherCreations began with a refusal to accept that powerful computers had to be loud, bright, or
              disposable. We design each system as a complete object: balanced thermals, enduring materials, and
              deliberate form.
            </p>
            <p>Every build is assembled and tested by one technician, from first component to final benchmark.</p>
            <a className="link-arrow" href={href("systems")}>
              Browse systems <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>The essential pieces.</h2>
            <a className="link-arrow" href={href("parts")}>
              View all parts <ArrowRight />
            </a>
          </div>
          <ul className="parts-row">
            {featuredParts.map((part) => (
              <li key={part.id}>
                <a className="part-tile" href={href("parts")}>
                  <div className="part-tile__media">
                    <Photo photo={part.photo} alt="" sizes="(min-width: 900px) 400px, 90vw" />
                  </div>
                  <span className="part-tile__name">{part.name}</span>
                  <span className="part-tile__type">{part.type}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
