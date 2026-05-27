import {
  aiDeliveryImage,
  productStrategyImage,
  serviceWorkflowImage,
  uxResearchImage,
} from "./imageAssets";
import { ResponsiveImage } from "./ResponsiveImage";
import { calendarUrl } from "./siteConfig";

const outcomes = [
  "clearer decision-making",
  "better adoption",
  "stronger operational alignment",
  "measurable outcomes",
  "systems that hold up under real-world pressure",
] as const;

const capabilityCards = [
  {
    title: "Experience & Product Design",
    body: "User experience, service design, workflow modeling, interface systems, and usability validation aligned to operational realities.",
  },
  {
    title: "Product Strategy & Delivery",
    body: "Roadmapping, prioritization, cross-functional alignment, and product leadership focused on measurable outcomes over feature volume.",
  },
  {
    title: "AI-Enabled Products & Workflows",
    body: "Human-centered AI integration that improves research, workflows, decision support, and operational efficiency while maintaining governance and accountability.",
  },
  {
    title: "Research & Decision Intelligence",
    body: "Research operations, synthesis, behavioral insight, and evidence-driven decision support to reduce risk and improve alignment.",
  },
  {
    title: "Design Systems & Operational Scale",
    body: "Scalable design systems, governance models, and operational frameworks that support consistency, speed, and maintainability.",
  },
  {
    title: "Cross-System Experience Architecture",
    body: "Connecting products, workflows, teams, and services into coherent operational ecosystems instead of isolated interfaces.",
  },
] as const;

const relevantExperience = [
  "Enterprise platforms & internal systems",
  "AI-enabled support ecosystems",
  "Workflow automation & orchestration",
  "Multi-product design systems",
  "Research operations & governance",
  "Operational modernization initiatives",
  "Knowledge management ecosystems",
  "Service transformation efforts",
] as const;

const environments = [
  "Government & defense",
  "Enterprise & regulated industries",
  "Mission-critical operational systems",
  "Complex service environments",
  "Cross-functional digital transformation efforts",
  "USSF / SSC program environments",
] as const;

const balancePoints = [
  "people",
  "process",
  "governance",
  "technology",
  "measurable outcomes",
] as const;

function AboutHeroVisual() {
  return (
    <div
      className="about-hero-visual"
      aria-label="Connected workflow diagram linking people, systems, and outcomes"
    >
      <div className="about-hero-grid" aria-hidden="true" />
      <div
        className="about-hero-photo about-hero-photo-primary"
        aria-hidden="true"
      >
        <ResponsiveImage
          image={serviceWorkflowImage}
          sizes="(min-width: 1024px) 18vw, 45vw"
        />
      </div>
      <div
        className="about-hero-photo about-hero-photo-secondary"
        aria-hidden="true"
      >
        <ResponsiveImage
          image={aiDeliveryImage}
          sizes="(min-width: 1024px) 16vw, 42vw"
        />
      </div>
      <svg
        className="about-hero-lines"
        viewBox="0 0 520 460"
        aria-hidden="true"
      >
        <path d="M88 292 248 178 422 248" />
        <path d="M132 126 248 178 382 82" />
        <path d="M248 178 274 344" />
        <path d="M88 292 274 344 422 248" />
      </svg>
      <div className="about-node about-node-people">People</div>
      <div className="about-node about-node-systems">Systems</div>
      <div className="about-node about-node-outcomes">Outcomes</div>
      <div className="about-outcome-mark" aria-hidden="true">
        <span>Elevated</span>
        <strong>Outcomes</strong>
      </div>
      <div className="about-callout-card">
        Design-led. Outcome-focused. Human-aware.
      </div>
    </div>
  );
}

function WhyVisual() {
  return (
    <div className="why-visual">
      <article>
        <span>P</span>
        <strong>People</strong>
        <p>Needs, behavior, adoption</p>
      </article>
      <article>
        <span>D</span>
        <strong>Product</strong>
        <p>Roadmaps, interfaces, services</p>
      </article>
      <article>
        <span>T</span>
        <strong>Technology</strong>
        <p>AI, platforms, data, delivery</p>
      </article>
      <article>
        <span>M</span>
        <strong>Mission / Business</strong>
        <p>Governance, risk, outcomes</p>
      </article>
    </div>
  );
}

function CapabilityVisual() {
  return (
    <div
      className="capability-visual"
      aria-label="Product ecosystem, workflow orchestration, and research synthesis"
    >
      <div className="capability-photo">
        <ResponsiveImage
          image={productStrategyImage}
          sizes="(min-width: 1024px) 24vw, 70vw"
        />
      </div>
      <div className="capability-panel capability-panel-one">
        <span>Research</span>
        <strong>Signal synthesis</strong>
      </div>
      <div className="capability-panel capability-panel-two">
        <span>Workflow</span>
        <strong>Decision path</strong>
      </div>
      <div className="capability-panel capability-panel-three">
        <span>System</span>
        <strong>Operational scale</strong>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-copy reveal-copy" data-reveal="copy">
          <p className="section-eyebrow">About Elevated</p>
          <h1>
            Where experience, systems, and outcomes are elevated together.
          </h1>
          <div className="about-hero-intro">
            <p>
              Elevated operates at the intersection of human-centered design,
              product strategy, operational systems, and AI-enabled delivery.
            </p>
            <p>
              We help organizations solve complex problems across mission,
              business, and technology environments—designing products,
              workflows, and services that are usable, scalable, and grounded in
              real operational needs.
            </p>
            <p>
              Our work bridges discovery through delivery, balancing people,
              systems, governance, and measurable outcomes without
              over-engineering or overselling.
            </p>
          </div>
        </div>
        <AboutHeroVisual />
      </section>

      <section className="about-section why-section">
        <div className="why-copy reveal-copy" data-reveal="copy">
          <h2>Why organizations partner with Elevated</h2>
          <p className="why-lead">We work where complexity is real.</p>
          <p>
            Many organizations struggle because technology, operations, and user
            needs evolve independently. Products become fragmented.
          </p>
          <p>
            Workflows become brittle. Teams lose visibility across systems and
            decisions.
          </p>
          <p>Elevated helps reconnect those pieces.</p>
          <p>
            We align research, strategy, experience design, and delivery around
            the actual environments people operate within—especially in
            regulated, high-stakes, or operationally complex spaces.
          </p>
          <ul className="outcome-list">
            {outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
        <WhyVisual />
      </section>

      <section className="about-section capabilities-section">
        <CapabilityVisual />
        <div>
          <div className="section-heading reveal-copy" data-reveal="copy">
            <h2>What we do</h2>
            <p>
              We design and support systems across the full lifecycle—from
              research and strategy through implementation and operational
              enablement.
            </p>
          </div>
          <div className="capability-grid">
            {capabilityCards.map((capability, index) => (
              <article
                className="capability-card reveal-copy"
                data-reveal="copy"
                key={capability.title}
                style={{ transitionDelay: `${80 + index * 45}ms` }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="thinking-section">
        <div className="thinking-inner reveal-copy" data-reveal="copy">
          <p>Strategy → Experience → Delivery → Outcomes</p>
          <h2>Too often, organizations separate strategy from execution.</h2>
          <div>
            <p>We do not.</p>
            <p>
              Elevated works across the full lifecycle—maintaining intent,
              usability, and operational alignment from early discovery through
              delivery and adoption.
            </p>
            <p>
              The result is systems that are not only designed well, but capable
              of functioning effectively in the environments they were built
              for.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section experience-section">
        <div className="section-heading reveal-copy" data-reveal="copy">
          <h2>Relevant experience</h2>
          <p>
            Our experience spans complex digital ecosystems, operational
            workflows, and enterprise-scale service environments.
          </p>
        </div>
        <ul className="experience-band">
          {relevantExperience.map((item, index) => (
            <li key={item} className="reveal-copy" data-reveal="copy">
              <span aria-hidden="true">{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="environment-section">
        <div className="section-heading reveal-copy" data-reveal="copy">
          <h2>Environments we support</h2>
        </div>
        <ul className="environment-list">
          {environments.map((environment) => (
            <li key={environment}>{environment}</li>
          ))}
        </ul>
      </section>

      <section className="about-section team-section">
        <div className="team-image image-frame">
          <ResponsiveImage
            image={uxResearchImage}
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
        </div>
        <div className="team-copy reveal-copy" data-reveal="copy">
          <h2>Built by product and systems leaders</h2>
          <p>
            Elevated was founded by leaders across product strategy, UX,
            operational systems, and digital delivery.
          </p>
          <p>
            Our approach combines human-centered design, technical
            understanding, research rigor, and operational awareness to help
            organizations navigate complexity without losing clarity.
          </p>
          <div className="team-quote">
            <p>Successful systems balance:</p>
            <ul>
              {balancePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <p>
            And we believe trust is earned through thoughtful execution—not
            inflated promises.
          </p>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="final-cta reveal-copy" data-reveal="copy">
          <h2>Let’s build systems that actually work in the real world.</h2>
          <p>
            Whether you're modernizing workflows, designing new services,
            improving operational alignment, or exploring AI-enabled
            capabilities, Elevated helps teams move with clarity and confidence.
          </p>
          <a href={calendarUrl} rel="noreferrer" target="_blank">
            Start a conversation
          </a>
        </div>
      </section>
    </>
  );
}
