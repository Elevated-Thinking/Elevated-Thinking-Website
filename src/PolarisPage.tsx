import { polarisHeroImage } from "./imageAssets";
import { ResponsiveImage } from "./ResponsiveImage";
import { calendarUrl, footerEmail } from "./siteConfig";

const editorialColumns = [
  {
    title: "Challenge",
    body: "Mission teams were navigating fragmented tools, dense information, and workflows that demanded too much effort to understand and complete.",
  },
  {
    title: "Approach",
    body: "We grounded the product in real user needs, aligned stakeholders around a shared product vision, and designed a scalable experience system that could evolve with the mission.",
  },
  {
    title: "Outcome",
    body: "Polaris gives teams a more coherent path through complex work—improving clarity, supporting adoption, and creating a stronger foundation for future capabilities.",
  },
] as const;

const recognition = [
  "USSF GenAI Challenge Winner — 2024",
  "USSF AI Challenge — Guardian Choice Winner — 2026",
  "USSF AI Challenge — CSO Choice Award",
] as const;

const contributions = [
  "Research-led strategy",
  "Product and experience design",
  "Design systems and operations",
  "Cross-functional delivery",
] as const;

export function PolarisPage() {
  return (
    <>
      <section className="polaris-hero">
        <div className="polaris-hero-copy reveal-copy" data-reveal="copy">
          <p className="section-eyebrow">Case Study · Space Force</p>
          <h1>Polaris brings clarity to complex mission work.</h1>
          <p>
            Polaris is a human-centered digital platform built to help Space
            Force teams navigate complex information, make confident decisions,
            and move mission work forward. Elevated partnered across strategy,
            product, design, and delivery to turn a high-stakes operational need
            into an experience people can trust and use.
          </p>
          <div className="polaris-hero-actions">
            <a href={calendarUrl} rel="noreferrer" target="_blank">
              Talk with Elevated
            </a>
            <a href="/about/#capabilities">Explore our capabilities</a>
          </div>
        </div>
        <div
          className="polaris-hero-visual reveal-image"
          data-reveal="image"
          data-reveal-direction="right"
        >
          <ResponsiveImage
            image={polarisHeroImage}
            sizes="(min-width: 1024px) 54vw, 100vw"
            eager
          />
        </div>
      </section>

      <section className="polaris-overview">
        <div className="polaris-overview-inner">
          <h2>A product built for the realities of mission work.</h2>
          <p>
            Polaris brings together the people, information, and workflows that
            often live across disconnected systems. The experience makes
            essential work easier to find, understand, and act on—without asking
            users to become experts in the system behind it.
          </p>
          <dl>
            <div>
              <dt>Client</dt>
              <dd>United States Space Force</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>
                Product strategy, UX research, experience design, design systems
              </dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>A clearer, more usable foundation for mission delivery</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="polaris-editorial" aria-label="Project approach">
        {editorialColumns.map(({ title, body }) => (
          <article key={title} className="reveal-copy" data-reveal="copy">
            <p>{title}</p>
            <h2>{body}</h2>
          </article>
        ))}
      </section>

      <section className="polaris-recognition">
        <div className="polaris-recognition-heading">
          <p className="section-eyebrow">Recognition</p>
          <h2>Recognized for mission-ready innovation.</h2>
          <p>
            Polaris has been recognized by the U.S. Space Force for advancing
            practical, human-centered applications of artificial intelligence.
          </p>
        </div>
        <ol>
          {recognition.map((award, index) => (
            <li key={award}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{award}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="polaris-contribution">
        <div>
          <p className="section-eyebrow">Elevated’s contribution</p>
          <h2>One connected practice, from insight to delivery.</h2>
        </div>
        <ol>
          {contributions.map((contribution, index) => (
            <li key={contribution}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{contribution}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="polaris-cta">
        <div>
          <h2>Building something complex? Let’s make it usable.</h2>
          <p>
            Elevated helps organizations turn high-stakes systems into products
            people can understand, trust, and use. Let’s talk about what your
            team needs next.
          </p>
        </div>
        <div className="polaris-cta-actions">
          <a href={calendarUrl} rel="noreferrer" target="_blank">
            Start a conversation <span aria-hidden="true">→</span>
          </a>
          <p>Or email us directly:</p>
          <a href={`mailto:${footerEmail}?subject=Hello`}>{footerEmail}</a>
        </div>
      </section>
    </>
  );
}
