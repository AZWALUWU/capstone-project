import { Suspense } from "react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight } from "lucide-react"
import BlogListSkeleton from "./loading"

// Categories for filtering
const categories = [
  "Semua",
  "Tips Kesehatan",
  "Nutrisi",
  "Pertolongan Pertama",
  "Kesehatan Mental",
  "Kesejahteraan",
  "Perawatan Kronis",
  "Pencegahan",
]

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const supabase = createServerClient()

  // Get the selected category from the URL or default to 'Semua'
  const selectedCategory = searchParams.category || "Semua"
  const searchQuery = searchParams.search || ""

  // Fetch posts with optional category filter and search
  let postsQuery = supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (selectedCategory !== "Semua") {
    postsQuery = postsQuery.eq("category", selectedCategory)
  }

  if (searchQuery) {
    postsQuery = postsQuery.or(`title.ilike.%${searchQuery}%, excerpt.ilike.%${searchQuery}%`)
  }

  const { data: posts } = await postsQuery

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog Kesehatan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Temukan artikel terbaru tentang kesehatan, tips gaya hidup sehat, dan informasi medis dari para ahli.
        </p>
      </div>

      <div className="mb-8">
        <form className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari artikel..."
            name="search"
            defaultValue={searchQuery}
            className="pl-10"
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1">
            Cari
          </Button>
        </form>
      </div>

      <Tabs defaultValue={selectedCategory} className="mb-12">
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <TabsList className="bg-muted/60">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category}${searchQuery ? `&search=${searchQuery}` : ""}`}
                passHref
              >
                <TabsTrigger value={category} className="px-4">
                  {category}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <Suspense fallback={<BlogListSkeleton />}>
              {posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={post.image_url || "/placeholder.svg?height=200&width=400"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
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
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/blog/${post.id}`} className="w-full">
                          <Button variant="outline" className="w-full gap-2">
                            Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Tidak ada artikel ditemukan</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `Tidak ada artikel yang cocok dengan pencarian "${searchQuery}"`
                      : selectedCategory === "Semua"
                        ? "Belum ada artikel yang tersedia saat ini."
                        : `Belum ada artikel dalam kategori ${selectedCategory}.`}
                  </p>
                  <Link href="/blog">
                    <Button>Lihat Semua Artikel</Button>
                  </Link>
                </div>
              )}
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

