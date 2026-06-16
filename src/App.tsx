import { AboutPage } from "./AboutPage";
import { HomePage } from "./HomePage";
import { SiteLayout } from "./SiteLayout";
import { useRevealParallax } from "./useRevealParallax";

function getCurrentPage(pathname: string) {
  return /\/about\/?$/.test(pathname) ? "about" : "home";
}

export default function ElevatedSite() {
  useRevealParallax();

  const currentPage = getCurrentPage(window.location.pathname);

  return (
    <SiteLayout currentPage={currentPage}>
      {currentPage === "about" ? <AboutPage /> : <HomePage />}
    </SiteLayout>
  );
}
