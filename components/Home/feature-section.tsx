import { ArrowRight, BookOpen, Heart, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Fitur Kami
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Fitur Utama Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sehatica menyediakan berbagai fitur untuk membantu Anda mengelola
            kesehatan dengan lebih baik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <Card className="border border-muted h-full bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30 group-hover:translate-y-[-8px]">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-7 w-7 text-primary group-hover:text-primary/80" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                  Diagnosis Kesehatan
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Dapatkan penilaian awal tentang gejala Anda dengan teknologi
                  AI kami.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <div className="border-t border-border/40 pt-4 mt-2">
                  Masukkan gejala Anda dan dapatkan kemungkinan kondisi
                  kesehatan beserta rekomendasi pertolongan pertama.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/diagnosis" className="w-full">
                  <Button
                    variant="outline"
                    className="gap-2 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Coba Sekarang{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="group mt-8 md:mt-0">
            <Card className="border border-muted h-full bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30 group-hover:translate-y-[-8px]">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 text-primary group-hover:text-primary/80" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                  Panduan Kesehatan
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Akses panduan langkah demi langkah untuk berbagai kondisi
                  kesehatan.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <div className="border-t border-border/40 pt-4 mt-2">
                  Pelajari cara mengenali, mengelola, dan mencegah berbagai
                  kondisi kesehatan dengan panduan komprehensif kami.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/guides" className="w-full">
                  <Button
                    variant="outline"
                    className="gap-2 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Lihat Panduan{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="group mt-8 md:mt-0">
            <Card className="border border-muted h-full bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30 group-hover:translate-y-[-8px]">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-7 w-7 text-primary group-hover:text-primary/80" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                  Blog Kesehatan
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Baca artikel terbaru tentang kesehatan dan kesejahteraan.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <div className="border-t border-border/40 pt-4 mt-2">
                  Dapatkan informasi terbaru tentang kesehatan, tips gaya hidup
                  sehat, dan berita medis dari para ahli.
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/blog" className="w-full">
                  <Button
                    variant="outline"
                    className="gap-2 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Baca Blog{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
