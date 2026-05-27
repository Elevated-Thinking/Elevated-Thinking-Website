import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const calendarUrl = "https://calendar.app.google/ShyxHfNAutZC3Dg7A";

async function gotoApp(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /systems thinking,\s*designed for reality\./i,
    })
  ).toBeVisible();
}

test("app smoke", async ({ page }) => {
  await gotoApp(page);

  await expect(
    page.getByRole("heading", {
      name: /built for work where decisions actually matter\./i,
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /contact/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /hello@elevatedthinking\.co/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /start a conversation/i }).first()
  ).toHaveAttribute("href", calendarUrl);
  await expect(
    page.getByRole("link", { name: /start a conversation/i }).first()
  ).toHaveAttribute("target", "_blank");
  await expect(
    page.getByRole("img", { name: /elevated/i }).first()
  ).toBeVisible();
});

test("about page smoke", async ({ page }) => {
  await page.goto("/about/");

  await expect(
    page.getByRole("heading", {
      name: /where experience, systems, and outcomes are elevated together\./i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /why organizations partner with elevated/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /what we do/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /^home$/i })).toHaveAttribute(
    "href",
    "../"
  );
  await expect(page.getByRole("link", { name: /^about$/i })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(
    page.getByRole("link", { name: /start a conversation/i }).first()
  ).toHaveAttribute("href", calendarUrl);
});

test("app exposes favicon assets", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.locator('link[rel="icon"][href="/favicon.ico"]')
  ).toHaveAttribute("sizes", "any");
  await expect(
    page.locator('link[rel="icon"][href="/favicon.svg"]')
  ).toHaveAttribute("type", "image/svg+xml");
  await expect(
    page.locator('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]')
  ).toHaveAttribute("sizes", "180x180");
  await expect(
    page.locator('link[rel="mask-icon"][href="/safari-pinned-tab.svg"]')
  ).toHaveAttribute("color", "#37514e");
  await expect(
    page.locator('link[rel="manifest"][href="/site.webmanifest"]')
  ).toHaveCount(1);

  for (const assetPath of [
    "/favicon.ico",
    "/favicon.svg",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/apple-touch-icon.png",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/safari-pinned-tab.svg",
    "/site.webmanifest",
  ]) {
    const response = await page.request.get(assetPath);
    expect(response.ok()).toBe(true);
  }
});

test("app exposes SEO and sharing metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Elevated Thinking");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.elevatedthinking.co/"
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow,max-image-preview:large"
  );

  const expectedOgTags = {
    "og:site_name": "Elevated Thinking",
    "og:title": "Elevated Thinking",
    "og:description":
      "Design-led strategy and AI-enabled product work for complex environments.",
    "og:type": "website",
    "og:url": "https://www.elevatedthinking.co/",
    "og:image": "https://www.elevatedthinking.co/og-image.jpg",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Elevated Thinking",
    "og:locale": "en_US",
  };

  for (const [property, content] of Object.entries(expectedOgTags)) {
    await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute(
      "content",
      content
    );
  }

  await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0);
});

test("generated SEO files and permanent social preview image are served", async ({
  page,
}) => {
  const robotsResponse = await page.request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain("User-agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain(
    "Sitemap: https://www.elevatedthinking.co/sitemap.xml"
  );

  const sitemapResponse = await page.request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemapText = await sitemapResponse.text();
  expect(sitemapText).toMatch(
    /<loc>\s*https:\/\/www\.elevatedthinking\.co\/\s*<\/loc>/
  );
  expect(sitemapText).toMatch(
    /<loc>\s*https:\/\/www\.elevatedthinking\.co\/about\/\s*<\/loc>/
  );
  expect(
    sitemapText.match(
      /<loc>\s*https:\/\/www\.elevatedthinking\.co\/\s*<\/loc>/g
    )
  ).toHaveLength(1);
  expect(
    sitemapText.match(
      /<loc>\s*https:\/\/www\.elevatedthinking\.co\/about\/\s*<\/loc>/g
    )
  ).toHaveLength(1);

  const ogImageResponse = await page.request.get("/og-image.jpg");
  expect(ogImageResponse.ok()).toBe(true);
  expect(ogImageResponse.headers()["content-type"]).toContain("image/jpeg");
});

test("page photography loads from local build assets", async ({ page }) => {
  await gotoApp(page);

  for (const name of [
    /person writing on white paper/i,
    /macbook near an open book/i,
    /workflow diagram/i,
    /two women sitting together/i,
    /person using a macbook/i,
  ]) {
    const image = page.getByRole("img", { name });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const img = element as HTMLImageElement;
          return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        })
      )
      .toBe(true);
  }

  const photoSources = await page
    .locator("main picture img")
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).currentSrc)
    );
  const pageOrigin = new URL(page.url()).origin;

  expect(photoSources).toHaveLength(5);
  for (const source of photoSources) {
    const url = new URL(source);
    expect(url.origin).toBe(pageOrigin);
    expect(url.pathname).toContain("/assets/");
  }
});

test("app has no critical accessibility violations", async ({ page }) => {
  await gotoApp(page);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
