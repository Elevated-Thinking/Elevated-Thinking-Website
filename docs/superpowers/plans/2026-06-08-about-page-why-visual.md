# About Page Current Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all actionable Apple Notes `Website Changes` > `Current notes:` about-page requests while deferring icon/visual replacements that require user-supplied assets.

**Architecture:** Keep the about page as a single React page with section-specific visual components in `src/AboutPage.tsx` and styling in `src/styles.css`. Use unit tests for DOM/content contracts and Playwright smoke tests for layout, hover, and responsive behavior.

**Tech Stack:** React, Vite, TypeScript, CSS, Jest Testing Library, Playwright.

---

## Current Notes Coverage

- [x] Update the `Why organizations partner with Elevated` visual cards to be larger, staggered, softly bordered white cards with a connector motif.
- [x] Keep `P / D / T / M` badges for now; replacement visual direction is blocked until supplied.
- [x] Fix the desktop `Relevant experience` band so it has more side padding and a smaller radius instead of a huge pill shape.
- [x] Add a subtle hover treatment to `Environments we support` rows.
- [x] Remove the about hero visual's center white `Elevated Outcomes` card.
- [x] Rename the about hero visual node from `Outcomes` to `Experience`.
- [x] Redraw the about hero dotted SVG paths around the remaining nodes.
- [x] Remove the gradient from the dark `How we think` section.
- [x] Keep numbered `What we do` capability badges for now; replacement icons are blocked until supplied.

## Implementation Checklist

- [x] Update `src/AboutPage.tsx`
  - Hero visual aria label now references `people, systems, and experience`.
  - Center `about-outcome-mark` markup removed.
  - `Outcomes` node replaced by `Experience`.
  - Dotted SVG paths rerouted without the removed center card.

- [x] Update `src/styles.css`
  - Removed unused `.about-outcome-mark` styles.
  - Added `.about-node-experience`.
  - Refined `.why-visual` card scale, spacing, connector, typography, and mobile reset.
  - Kept `.capability-card span` styling independent from larger why-card badges.
  - Changed `.thinking-section` to a solid `var(--color-primary)` background.
  - Changed `.experience-band` desktop radius to `1.75rem` and increased desktop padding/gaps.
  - Added environment row hover transition, accent color, warmer border, and slight lift.

- [x] Update `tests/unit/app.test.tsx`
  - Verifies requested why-card labels and details.
  - Verifies the about hero uses the new aria label and `Experience` node.
  - Verifies the center `Elevated Outcomes` card is absent.
  - Verifies capability cards keep numbered badges until icons are supplied.

- [x] Update `tests/smoke/app.spec.ts`
  - Verifies hero visual removal/rename in the browser.
  - Verifies desktop why-card composition.
  - Verifies mobile why-card and experience-band stacking.
  - Verifies desktop experience-band radius/padding.
  - Verifies environment row hover treatment.

## Deferred Follow-Ups

- [ ] Replace the `WhyVisual` letter badges once the user provides the alternate visual direction.
- [ ] Replace `What we do` numbered capability badges once the user provides the icons.

## Validation

- [x] Red unit test observed before implementation: old hero aria label still referenced outcomes.
- [x] Red smoke tests observed before implementation: old hero label/card, small why cards, pill-shaped experience band, and missing hover treatment.
- [x] Focused unit test passed: `npm run test:unit -- tests/unit/app.test.tsx --runInBand`
- [x] Focused smoke subset passed: `npm run test:smoke -- --grep "about (hero visual|page why visual|page relevant experience|page environment)"`
- [x] Full validation:
  - `npm run build`
  - `npm run typecheck`
  - `npm run test:unit`
  - `npm run test:smoke`
- [x] Manual browser QA at desktop `1440x1000` and mobile `390x900`.
- [x] Mobile browser QA confirmed no horizontal overflow at `390x900`.
