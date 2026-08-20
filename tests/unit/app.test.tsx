import { render, screen } from "@testing-library/react";

import App from "../../src/App";

const calendarUrl = "https://calendar.app.google/ShyxHfNAutZC3Dg7A";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the hero heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /systems thinking,\s*designed for reality\./i,
      })
    ).toBeInTheDocument();
  });

  it("shows all named services", () => {
    render(<App />);

    expect(
      screen.getAllByRole("heading", { name: /product strategy/i })
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { name: /service & workflow design/i })
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { name: /ux research & design/i })
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { name: /ai-enabled delivery/i })
    ).toHaveLength(1);
  });

  it("includes navigation and accessibility landmarks", () => {
    render(<App />);

    expect(
      screen.getByRole("link", { name: /skip to main content/i })
    ).toHaveAttribute("href", "#main-content");

    expect(
      screen.getByRole("navigation", { name: /primary/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^about$/i })).toHaveAttribute(
      "href",
      "/about/"
    );
    expect(screen.getByRole("link", { name: /^polaris$/i })).toHaveAttribute(
      "href",
      "/polaris/"
    );
    expect(screen.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
      "href",
      "#contact"
    );
    expect(
      screen.queryByRole("link", { name: /^home$/i })
    ).not.toBeInTheDocument();

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");

    expect(
      screen.getAllByRole("link", {
        name: /start a conversation/i,
      })
    ).toHaveLength(2);
  });

  it("uses the requested logo, images, contact email, and calendar CTAs", () => {
    render(<App />);

    expect(screen.getAllByRole("img", { name: /elevated/i })).toHaveLength(2);

    for (const link of screen.getAllByRole("link", {
      name: /start a conversation/i,
    })) {
      expect(link).toHaveAttribute("href", calendarUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }

    expect(
      screen.getByRole("link", { name: /hello@elevatedthinking\.co/i })
    ).toHaveAttribute("href", "mailto:hello@elevatedthinking.co?subject=Hello");
    expect(
      screen.queryByRole("link", { name: /lindsey@elevatedthinking\.co/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /paul@elevatedthinking\.co/i })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: /person writing on white paper/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /macbook near an open book/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /workflow diagram/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /two women sitting together/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /person using a macbook/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/AI-enabled\. Not AI-obsessed\./i)
    ).not.toBeInTheDocument();
  });

  it("serves page photography from local responsive picture assets", () => {
    const { container } = render(<App />);

    expect(container.querySelectorAll("picture")).toHaveLength(5);
    expect(
      container.querySelectorAll('source[type="image/avif"]')
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('source[type="image/webp"]')
    ).toHaveLength(5);

    for (const source of container.querySelectorAll("picture source")) {
      expect(source).toHaveAttribute("srcset", expect.stringContaining("640w"));
      expect(source).toHaveAttribute("srcset", expect.stringContaining("960w"));
      expect(source).toHaveAttribute(
        "srcset",
        expect.stringContaining("1280w")
      );
      expect(source).toHaveAttribute(
        "srcset",
        expect.stringContaining("1600w")
      );
    }
  });

  it("keeps image loading priority aligned to viewport importance", () => {
    render(<App />);

    expect(
      screen.getByRole("img", { name: /person writing on white paper/i })
    ).toHaveAttribute("loading", "eager");
    expect(
      screen.getByRole("img", { name: /person writing on white paper/i })
    ).toHaveAttribute("fetchpriority", "high");

    for (const image of [
      screen.getByRole("img", { name: /macbook near an open book/i }),
      screen.getByRole("img", { name: /workflow diagram/i }),
      screen.getByRole("img", { name: /two women sitting together/i }),
      screen.getByRole("img", { name: /person using a macbook/i }),
    ]) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("fetchpriority", "auto");
    }
  });

  it("aligns footer contact with the supporting brand copy on desktop", () => {
    const { container } = render(<App />);
    const footer = container.querySelector("footer");

    expect(footer?.querySelector(":scope > div")).toHaveClass(
      "lg:grid-cols-[auto_1fr]"
    );
    expect(footer?.querySelector("p")).toHaveClass("lg:row-start-2");
    expect(footer?.querySelector("address")).toHaveClass(
      "lg:row-start-2",
      "lg:justify-self-end"
    );
  });

  it("renders the about page from the dedicated about path", () => {
    window.history.replaceState({}, "", "/about/");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /where experience, systems, and outcomes are elevated together\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/design-led\. outcome-focused\. human-aware\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /why organizations partner with elevated/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /what we do/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /built by product and systems leaders/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^home$/i })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/elevated home/i)).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /^about$/i })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the Polaris case study from its dedicated path", () => {
    window.history.replaceState({}, "", "/polaris/");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /polaris brings clarity to complex mission work\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /recognized for mission-ready innovation\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ussf genai challenge winner/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore our capabilities/i })
    ).toHaveAttribute("href", "/about/#capabilities");
    expect(screen.getByRole("link", { name: /^polaris$/i })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getAllByRole("link", {
        name: /talk with elevated|start a conversation/i,
      })
    ).toHaveLength(2);
    for (const link of screen.getAllByRole("link", {
      name: /hello@elevatedthinking\.co/i,
    })) {
      expect(link).toHaveAttribute(
        "href",
        "mailto:hello@elevatedthinking.co?subject=Hello"
      );
    }
    expect(screen.getByLabelText(/elevated home/i)).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /^about$/i })).toHaveAttribute(
      "href",
      "/about/"
    );
  });

  it("keeps shared navigation within an Azure PR preview", () => {
    window.history.replaceState({}, "", "/preview/pr/43/polaris/");

    render(<App />);

    expect(screen.getByLabelText(/elevated home/i)).toHaveAttribute(
      "href",
      "/preview/pr/43/"
    );
    expect(screen.getByRole("link", { name: /^about$/i })).toHaveAttribute(
      "href",
      "/preview/pr/43/about/"
    );
    expect(screen.getByRole("link", { name: /^polaris$/i })).toHaveAttribute(
      "href",
      "/preview/pr/43/polaris/"
    );
    expect(
      screen.getByRole("link", { name: /explore our capabilities/i })
    ).toHaveAttribute("href", "/preview/pr/43/about/#capabilities");
  });

  it("renders the requested about page why visual labels", () => {
    window.history.replaceState({}, "", "/about/");

    render(<App />);

    for (const [badge, title, detail] of [
      ["P", "People", "Needs, behavior, adoption"],
      ["D", "Product", "Roadmaps, interfaces, services"],
      ["T", "Technology", "AI, platforms, data, delivery"],
      ["M", "Mission / Business", "Governance, risk, outcomes"],
    ]) {
      expect(screen.getByText(badge)).toBeInTheDocument();
      expect(
        screen.getByText(title, { selector: ".why-visual strong" })
      ).toBeInTheDocument();
      expect(screen.getByText(detail)).toBeInTheDocument();
    }
  });

  it("updates the about hero visual without the center outcomes card", () => {
    window.history.replaceState({}, "", "/about/");

    const { container } = render(<App />);

    expect(
      screen.getByLabelText(
        /connected workflow diagram linking people, systems, and experience/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Experience", { selector: ".about-node" })
    ).toBeInTheDocument();
    expect(screen.queryByText(/elevated outcomes/i)).not.toBeInTheDocument();
    expect(container.querySelector(".about-outcome-mark")).toBeNull();
  });

  it("keeps numbered capability badges until icons are supplied", () => {
    window.history.replaceState({}, "", "/about/");

    const { container } = render(<App />);

    expect(
      Array.from(container.querySelectorAll(".capability-card span")).map(
        (badge) => badge.textContent
      )
    ).toEqual(["01", "02", "03", "04", "05", "06"]);
  });
});
