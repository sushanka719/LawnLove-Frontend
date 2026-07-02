import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { WhyUs } from "@/components/landing/why-us";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BeforeAfter } from "@/components/landing/before-after";
import { Reviews } from "@/components/landing/reviews";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Services />
        <WhyUs />
        <HowItWorks />
        <BeforeAfter />
        <Reviews />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
