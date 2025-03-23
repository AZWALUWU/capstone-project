import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left column - Description */}
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Solusi Kesehatan Digital
              </span>{" "}
              <span className="relative inline-block">
                <span className="text-primary animate-pulse">Terpercaya</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/20 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-wide text-muted-foreground mb-10">
              Dapatkan diagnosis awal, panduan kesehatan, dan informasi medis
              terpercaya untuk membantu Anda mengelola kesehatan dengan lebih
              baik.
            </p>
            <div className="flex">
              <Link href="/diagnosis">
                <Button
                  size="lg"
                  className="gap-2 transition-all duration-300 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25
                 "
                >
                  Mulai Diagnosis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="order-first md:order-last">
            <Image
              src="/images/ilustrasi-hero.svg"
              alt="Solusi Kesehatan Digital"
              className="w-full h-full object-cover"
              width={450}
              height={450}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
