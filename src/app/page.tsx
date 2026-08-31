import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { ArchiveThreshold } from "@/components/sections/archive-threshold";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Library } from "@/components/sections/library";
import { PracticeIndex } from "@/components/sections/practice-index";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <ArchiveThreshold />
        <Library />
        <PracticeIndex />
        <About />
        <Contact />
      </main>
    </>
  );
}
