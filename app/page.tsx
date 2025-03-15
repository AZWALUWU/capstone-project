import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase-server"
import { ArrowRight, Stethoscope, BookOpen, Heart, ArrowUpRight } from "lucide-react"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch recent blog posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Solusi Kesehatan Digital <span className="text-primary">Terpercaya</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Dapatkan diagnosis awal, panduan kesehatan, dan informasi medis terpercaya untuk membantu Anda mengelola
            kesehatan dengan lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnosis">
              <Button size="lg" className="gap-2">
                Mulai Diagnosis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline" className="gap-2">
                Jelajahi Panduan <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Utama Kami</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sehatica menyediakan berbagai fitur untuk membantu Anda mengelola kesehatan dengan lebih baik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Diagnosis Kesehatan</CardTitle>
                <CardDescription>Dapatkan penilaian awal tentang gejala Anda dengan teknologi AI kami.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Masukkan gejala Anda dan dapatkan kemungkinan kondisi kesehatan beserta rekomendasi pertolongan pertama.
              </CardContent>
              <CardFooter>
                <Link href="/diagnosis">
                  <Button variant="ghost" className="gap-2">
                    Coba Sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Panduan Kesehatan</CardTitle>
                <CardDescription>Akses panduan langkah demi langkah untuk berbagai kondisi kesehatan.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Pelajari cara mengenali, mengelola, dan mencegah berbagai kondisi kesehatan dengan panduan komprehensif
                kami.
              </CardContent>
              <CardFooter>
                <Link href="/guides">
                  <Button variant="ghost" className="gap-2">
                    Lihat Panduan <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Blog Kesehatan</CardTitle>
                <CardDescription>Baca artikel terbaru tentang kesehatan dan kesejahteraan.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Dapatkan informasi terbaru tentang kesehatan, tips gaya hidup sehat, dan berita medis dari para ahli.
              </CardContent>
              <CardFooter>
                <Link href="/blog">
                  <Button variant="ghost" className="gap-2">
                    Baca Blog <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts && recentPosts.length > 0
              ? recentPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.image_url || "/placeholder.svg?height=200&width=400"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/blog/${post.id}`} className="w-full">
                        <Button variant="outline" className="w-full gap-2">
                          Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=Artikel+${i + 1}`}
                        alt="Placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Kesehatan</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <CardTitle>Artikel Kesehatan {i + 1}</CardTitle>
                      <CardDescription>
                        Informasi penting tentang kesehatan dan kesejahteraan untuk kehidupan yang lebih baik.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full gap-2" disabled>
                        Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Mulai Perjalanan Kesehatan Anda Hari Ini</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
            Bergabunglah dengan ribuan orang yang telah menggunakan Sehatica untuk mengelola kesehatan mereka dengan
            lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Daftar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                Pelajari Lebih Lanjut <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

