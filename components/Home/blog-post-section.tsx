import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function BlogPostSection({ recentPosts }) {
  return (
    <section className="py-24 bg-gradient-to-r from-muted/10 via-muted/30 to-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Blog & Artikel
          </div>
          <h2 className="text-4xl font-bold mb-4">Artikel Terbaru</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Temukan informasi terkini seputar kesehatan dari para ahli untuk
            membantu Anda menjalani hidup yang lebih sehat.
          </p>
          <div className="flex justify-end">
            <Link href="/blog">
              <Button
                variant="outline"
                className="gap-2 group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Lihat Semua{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts && recentPosts.length > 0
            ? recentPosts.map((post) => (
                <div key={post.id} className="group">
                  <CardContent className="overflow-hidden border border-border/50 h-full shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:translate-y-[-6px]">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={
                          post.image_url ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-xs px-3 py-1.5 bg-primary/80 text-primary-foreground rounded-full font-medium backdrop-blur-sm shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 mr-1 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(post.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 mt-auto border-t border-border/30 mt-4">
                      <Link href={`/blog/${post.id}`} className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full gap-2 mt-2 hover:bg-primary/10 group-hover:text-primary"
                        >
                          Baca Selengkapnya{" "}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </CardContent>
                </div>
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="group">
                  <Card className="overflow-hidden border border-border/50 h-full shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:translate-y-[-6px]">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=Artikel+${
                          i + 1
                        }`}
                        alt="Placeholder"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-xs px-3 py-1.5 bg-primary/80 text-primary-foreground rounded-full font-medium backdrop-blur-sm shadow-sm">
                          Kesehatan
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 mr-1 opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        Artikel Kesehatan {i + 1}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Informasi penting tentang kesehatan dan kesejahteraan
                        untuk kehidupan yang lebih baik.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 mt-auto border-t border-border/30 mt-4">
                      <Button
                        variant="ghost"
                        className="w-full gap-2 mt-2 hover:bg-primary/10"
                        disabled
                      >
                        Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
