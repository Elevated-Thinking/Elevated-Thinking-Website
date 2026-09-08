import { AboutPage } from "./AboutPage";
import { HomePage } from "./HomePage";
import { PolarisPage } from "./PolarisPage";
import { SiteLayout } from "./SiteLayout";
import { useRevealParallax } from "./useRevealParallax";

function getCurrentPage(pathname: string) {
  if (/\/polaris\/?$/.test(pathname)) return "polaris";
  if (/\/about\/?$/.test(pathname)) return "about";
  return "home";
}

export default function ElevatedSite() {
  useRevealParallax();

  const currentPage = getCurrentPage(window.location.pathname);

  return (
    <SiteLayout currentPage={currentPage}>
      {currentPage === "about" ? (
        <AboutPage />
      ) : currentPage === "polaris" ? (
        <PolarisPage />
      ) : (
        <HomePage />
      )}
    </SiteLayout>
  );
}
