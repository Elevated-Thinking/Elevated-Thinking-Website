import aiDelivery1280Avif from "./assets/images/optimized/ai-delivery-1280.avif";
import aiDelivery1280Jpg from "./assets/images/optimized/ai-delivery-1280.jpg";
import aiDelivery1280Webp from "./assets/images/optimized/ai-delivery-1280.webp";
import aiDelivery1600Avif from "./assets/images/optimized/ai-delivery-1600.avif";
import aiDelivery1600Jpg from "./assets/images/optimized/ai-delivery-1600.jpg";
import aiDelivery1600Webp from "./assets/images/optimized/ai-delivery-1600.webp";
import aiDelivery640Avif from "./assets/images/optimized/ai-delivery-640.avif";
import aiDelivery640Jpg from "./assets/images/optimized/ai-delivery-640.jpg";
import aiDelivery640Webp from "./assets/images/optimized/ai-delivery-640.webp";
import aiDelivery960Avif from "./assets/images/optimized/ai-delivery-960.avif";
import aiDelivery960Jpg from "./assets/images/optimized/ai-delivery-960.jpg";
import aiDelivery960Webp from "./assets/images/optimized/ai-delivery-960.webp";
import hero1280Avif from "./assets/images/optimized/hero-1280.avif";
import hero1280Jpg from "./assets/images/optimized/hero-1280.jpg";
import hero1280Webp from "./assets/images/optimized/hero-1280.webp";
import hero1600Avif from "./assets/images/optimized/hero-1600.avif";
import hero1600Jpg from "./assets/images/optimized/hero-1600.jpg";
import hero1600Webp from "./assets/images/optimized/hero-1600.webp";
import hero640Avif from "./assets/images/optimized/hero-640.avif";
import hero640Jpg from "./assets/images/optimized/hero-640.jpg";
import hero640Webp from "./assets/images/optimized/hero-640.webp";
import hero960Avif from "./assets/images/optimized/hero-960.avif";
import hero960Jpg from "./assets/images/optimized/hero-960.jpg";
import hero960Webp from "./assets/images/optimized/hero-960.webp";
import productStrategy1280Avif from "./assets/images/optimized/product-strategy-1280.avif";
import productStrategy1280Jpg from "./assets/images/optimized/product-strategy-1280.jpg";
import productStrategy1280Webp from "./assets/images/optimized/product-strategy-1280.webp";
import productStrategy1600Avif from "./assets/images/optimized/product-strategy-1600.avif";
import productStrategy1600Jpg from "./assets/images/optimized/product-strategy-1600.jpg";
import productStrategy1600Webp from "./assets/images/optimized/product-strategy-1600.webp";
import productStrategy640Avif from "./assets/images/optimized/product-strategy-640.avif";
import productStrategy640Jpg from "./assets/images/optimized/product-strategy-640.jpg";
import productStrategy640Webp from "./assets/images/optimized/product-strategy-640.webp";
import productStrategy960Avif from "./assets/images/optimized/product-strategy-960.avif";
import productStrategy960Jpg from "./assets/images/optimized/product-strategy-960.jpg";
import productStrategy960Webp from "./assets/images/optimized/product-strategy-960.webp";
import polarisHero1280Avif from "./assets/images/optimized/polaris-hero-1280.avif";
import polarisHero1280Jpg from "./assets/images/optimized/polaris-hero-1280.jpg";
import polarisHero1280Webp from "./assets/images/optimized/polaris-hero-1280.webp";
import polarisHero1600Avif from "./assets/images/optimized/polaris-hero-1600.avif";
import polarisHero1600Jpg from "./assets/images/optimized/polaris-hero-1600.jpg";
import polarisHero1600Webp from "./assets/images/optimized/polaris-hero-1600.webp";
import polarisHero640Avif from "./assets/images/optimized/polaris-hero-640.avif";
import polarisHero640Jpg from "./assets/images/optimized/polaris-hero-640.jpg";
import polarisHero640Webp from "./assets/images/optimized/polaris-hero-640.webp";
import polarisHero960Avif from "./assets/images/optimized/polaris-hero-960.avif";
import polarisHero960Jpg from "./assets/images/optimized/polaris-hero-960.jpg";
import polarisHero960Webp from "./assets/images/optimized/polaris-hero-960.webp";
import serviceWorkflow1280Avif from "./assets/images/optimized/service-workflow-1280.avif";
import serviceWorkflow1280Jpg from "./assets/images/optimized/service-workflow-1280.jpg";
import serviceWorkflow1280Webp from "./assets/images/optimized/service-workflow-1280.webp";
import serviceWorkflow1600Avif from "./assets/images/optimized/service-workflow-1600.avif";
import serviceWorkflow1600Jpg from "./assets/images/optimized/service-workflow-1600.jpg";
import serviceWorkflow1600Webp from "./assets/images/optimized/service-workflow-1600.webp";
import serviceWorkflow640Avif from "./assets/images/optimized/service-workflow-640.avif";
import serviceWorkflow640Jpg from "./assets/images/optimized/service-workflow-640.jpg";
import serviceWorkflow640Webp from "./assets/images/optimized/service-workflow-640.webp";
import serviceWorkflow960Avif from "./assets/images/optimized/service-workflow-960.avif";
import serviceWorkflow960Jpg from "./assets/images/optimized/service-workflow-960.jpg";
import serviceWorkflow960Webp from "./assets/images/optimized/service-workflow-960.webp";
import uxResearch1280Avif from "./assets/images/optimized/ux-research-1280.avif";
import uxResearch1280Jpg from "./assets/images/optimized/ux-research-1280.jpg";
import uxResearch1280Webp from "./assets/images/optimized/ux-research-1280.webp";
import uxResearch1600Avif from "./assets/images/optimized/ux-research-1600.avif";
import uxResearch1600Jpg from "./assets/images/optimized/ux-research-1600.jpg";
import uxResearch1600Webp from "./assets/images/optimized/ux-research-1600.webp";
import uxResearch640Avif from "./assets/images/optimized/ux-research-640.avif";
import uxResearch640Jpg from "./assets/images/optimized/ux-research-640.jpg";
import uxResearch640Webp from "./assets/images/optimized/ux-research-640.webp";
import uxResearch960Avif from "./assets/images/optimized/ux-research-960.avif";
import uxResearch960Jpg from "./assets/images/optimized/ux-research-960.jpg";
import uxResearch960Webp from "./assets/images/optimized/ux-research-960.webp";

type ImageVariant = {
  src: string;
  width: number;
};

export type ResponsiveImageAsset = {
  alt: string;
  position?: string;
  width: number;
  height: number;
  sources: {
    avif: readonly ImageVariant[];
    webp: readonly ImageVariant[];
    jpg: readonly ImageVariant[];
  };
};

const dimensions = {
  width: 1600,
  height: 2000,
};

function variants(
  image640: string,
  image960: string,
  image1280: string,
  image1600: string
): readonly ImageVariant[] {
  return [
    { src: image640, width: 640 },
    { src: image960, width: 960 },
    { src: image1280, width: 1280 },
    { src: image1600, width: 1600 },
  ];
}

export function imageSrcSet(sources: readonly ImageVariant[]) {
  return sources.map(({ src, width }) => `${src} ${width}w`).join(", ");
}

export const heroImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "Person writing on white paper",
  position: "center",
  sources: {
    avif: variants(hero640Avif, hero960Avif, hero1280Avif, hero1600Avif),
    webp: variants(hero640Webp, hero960Webp, hero1280Webp, hero1600Webp),
    jpg: variants(hero640Jpg, hero960Jpg, hero1280Jpg, hero1600Jpg),
  },
};

export const productStrategyImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "MacBook near an open book",
  position: "center",
  sources: {
    avif: variants(
      productStrategy640Avif,
      productStrategy960Avif,
      productStrategy1280Avif,
      productStrategy1600Avif
    ),
    webp: variants(
      productStrategy640Webp,
      productStrategy960Webp,
      productStrategy1280Webp,
      productStrategy1600Webp
    ),
    jpg: variants(
      productStrategy640Jpg,
      productStrategy960Jpg,
      productStrategy1280Jpg,
      productStrategy1600Jpg
    ),
  },
};

export const polarisHeroImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "Abstract mission systems visualization with layered information pathways",
  position: "center",
  sources: {
    avif: variants(
      polarisHero640Avif,
      polarisHero960Avif,
      polarisHero1280Avif,
      polarisHero1600Avif
    ),
    webp: variants(
      polarisHero640Webp,
      polarisHero960Webp,
      polarisHero1280Webp,
      polarisHero1600Webp
    ),
    jpg: variants(
      polarisHero640Jpg,
      polarisHero960Jpg,
      polarisHero1280Jpg,
      polarisHero1600Jpg
    ),
  },
};

export const serviceWorkflowImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "Workflow diagram showing product brief and user goals",
  position: "center",
  sources: {
    avif: variants(
      serviceWorkflow640Avif,
      serviceWorkflow960Avif,
      serviceWorkflow1280Avif,
      serviceWorkflow1600Avif
    ),
    webp: variants(
      serviceWorkflow640Webp,
      serviceWorkflow960Webp,
      serviceWorkflow1280Webp,
      serviceWorkflow1600Webp
    ),
    jpg: variants(
      serviceWorkflow640Jpg,
      serviceWorkflow960Jpg,
      serviceWorkflow1280Jpg,
      serviceWorkflow1600Jpg
    ),
  },
};

export const uxResearchImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "Two women sitting together",
  position: "center",
  sources: {
    avif: variants(
      uxResearch640Avif,
      uxResearch960Avif,
      uxResearch1280Avif,
      uxResearch1600Avif
    ),
    webp: variants(
      uxResearch640Webp,
      uxResearch960Webp,
      uxResearch1280Webp,
      uxResearch1600Webp
    ),
    jpg: variants(
      uxResearch640Jpg,
      uxResearch960Jpg,
      uxResearch1280Jpg,
      uxResearch1600Jpg
    ),
  },
};

export const aiDeliveryImage: ResponsiveImageAsset = {
  ...dimensions,
  alt: "Person using a MacBook",
  position: "center",
  sources: {
    avif: variants(
      aiDelivery640Avif,
      aiDelivery960Avif,
      aiDelivery1280Avif,
      aiDelivery1600Avif
    ),
    webp: variants(
      aiDelivery640Webp,
      aiDelivery960Webp,
      aiDelivery1280Webp,
      aiDelivery1600Webp
    ),
    jpg: variants(
      aiDelivery640Jpg,
      aiDelivery960Jpg,
      aiDelivery1280Jpg,
      aiDelivery1600Jpg
    ),
  },
};
