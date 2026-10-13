import { useState, type KeyboardEvent } from "react";
import { slides } from "../data";
import { href } from "../router";
import { ArrowLeft, ArrowRight } from "./Icons";
import Photo from "./Photo";

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  };

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="Signature systems"
      onKeyDown={onKeyDown}
    >
      <div className="carousel__slides" aria-live="polite">
        {slides.map((slide, i) => (
          <div
            key={slide.photo}
            className={i === index ? "slide is-active" : "slide"}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
          >
            <Photo photo={slide.photo} alt={slide.alt} widths={[800, 1280, 1800]} sizes="(min-width: 1280px) 1280px, 100vw" />
            <div className="slide__copy">
              <h3>{slide.title}</h3>
              <p>Purpose-built machines without visual noise. Every component considered, every cable hidden.</p>
              <a className="link-arrow" href={href("systems")}>
                Explore the collection <ArrowRight />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__controls">
        <div className="carousel__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.photo}
              type="button"
              className="dot"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="round-button" aria-label="Previous slide" onClick={() => go(index - 1)}>
          <ArrowLeft />
        </button>
        <button type="button" className="round-button" aria-label="Next slide" onClick={() => go(index + 1)}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
