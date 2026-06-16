import {
  aiDeliveryImage,
  productStrategyImage,
  serviceWorkflowImage,
  type ResponsiveImageAsset,
  uxResearchImage,
  heroImage,
} from "./imageAssets";
import { ResponsiveImage } from "./ResponsiveImage";
import { calendarUrl } from "./siteConfig";

type Service = {
  title: string;
  body: string;
  image: ResponsiveImageAsset;
};

const services: readonly Service[] = [
  {
    title: "Product strategy",
    body: "Clarify what to build, why it matters, and how decisions ripple across the system before they harden into roadmap debt.",
    image: productStrategyImage,
  },
  {
    title: "Service & workflow design",
    body: "Map the real-world flow of people, policy, tools, and handoffs so teams can reduce friction instead of decorating it.",
    image: serviceWorkflowImage,
  },
  {
    title: "UX research & design",
    body: "Design for real users, real constraints, and real environments—especially where stakes are high.",
    image: uxResearchImage,
  },
  {
    title: "AI-enabled delivery",
    body: "Use AI where it improves speed, insight, or decision support—without turning judgment into a black box circus.",
    image: aiDeliveryImage,
  },
];

export function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div
          className="reveal-copy"
          data-reveal="copy"
          style={{ transitionDelay: "80ms" }}
        >
          <h1 className="text-5xl leading-[0.95] font-serif md:text-6xl">
            Systems thinking,
            <br />
            designed for reality.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-primary)]/90">
            Elevated helps teams make better decisions across product, service,
            and operational systems using design, strategy, and AI where it
            actually matters.
          </p>
          <a
            href={calendarUrl}
            rel="noreferrer"
            target="_blank"
            className="mt-8 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-3 text-white"
          >
            Start a conversation
          </a>
        </div>

        <div
          className="reveal-image image-frame"
          data-parallax
          data-parallax-speed="34"
          data-reveal="image"
          data-reveal-direction="right"
        >
          <ResponsiveImage
            image={heroImage}
            sizes="(min-width: 1024px) 50vw, 100vw"
            eager
          />
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl space-y-24 px-6 py-16"
      >
        <h2 className="sr-only">Services</h2>
        <ul className="space-y-24">
          {services.map((service, i) => (
            <li
              key={service.title}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 !== 0
                  ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
                  : ""
              }`}
            >
              <div
                className="reveal-image image-frame"
                data-parallax
                data-parallax-speed="30"
                data-reveal="image"
                data-reveal-direction={i % 2 === 0 ? "left" : "right"}
              >
                <ResponsiveImage
                  image={service.image}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>

              <article
                className="reveal-copy"
                data-reveal="copy"
                style={{ transitionDelay: `${120 + i * 80}ms` }}
              >
                <h3 className="text-4xl font-serif leading-tight">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-md text-lg text-[var(--color-primary)]/90">
                  {service.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="approach"
        className="bg-[var(--color-primary)] px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-serif leading-tight">
            Built for work where decisions actually matter.
          </h2>
          <p className="mt-6 text-lg text-white/80">
            Government. Defense. Enterprise. Regulated environments. Places
            where complexity is real and shortcuts do not survive contact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative rounded-3xl bg-[var(--color-surface)] p-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-serif leading-tight">
              Bring us in when the problem spans teams, systems, or
              consequences.
            </h2>
            <p className="mt-4 text-[var(--color-primary)]">
              Especially early, before decisions calcify into expensive
              problems.
            </p>
          </div>

          <a
            href={calendarUrl}
            rel="noreferrer"
            target="_blank"
            className="absolute -bottom-5 right-10 rounded-xl bg-[var(--color-accent)] px-6 py-4 text-white shadow-lg"
          >
            Start a conversation
          </a>
        </div>
      </section>
    </>
  );
}
