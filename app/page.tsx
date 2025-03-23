import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggleLarge } from "@/components/theme-toggle-large";
import HeroSection from "@/components/Home/hero-section";
import FeaturesSection from "@/components/Home/feature-section";
import BlogPostSection from "@/components/Home/blog-post-section";

export default async function HomePage() {
  // Fetch recent blog posts with error handling
  let recentPosts = [];
  let supabaseError = null;

  try {
    // Import the createServerClient function dynamically to handle potential errors
    const { createServerClient } = await import("@/lib/supabase-server");
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) throw error;
    recentPosts = data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    supabaseError =
      "Failed to connect to the database. Please check your Supabase configuration.";
  }

  return (
    <main>
      {/* Floating theme toggle button */}
      <ThemeToggleLarge />

      {/* Display error message if Supabase connection failed */}
      {supabaseError && (
        <div className="container mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{supabaseError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Recent Blog Posts */}
      <BlogPostSection recentPosts={recentPosts} />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mulai Perjalanan Kesehatan Anda Hari Ini
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
            Bergabunglah dengan ribuan orang yang telah menggunakan Sehatica
            untuk mengelola kesehatan mereka dengan lebih baik.
          </p>
          <div className="flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-lg shadow-primary-foreground/10 hover:shadow-xl hover:shadow-primary-foreground/20 transition-all duration-300"
              >
                Daftar Sekarang <ArrowRight className="h-4 w-4 " />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
