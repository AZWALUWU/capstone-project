import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon } from "lucide-react"

// Categories for filtering
const categories = ["All", "First Aid", "Health Condition", "Preventive Care", "Emergency", "Wellness"]

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the selected category from the URL or default to 'All'
  const selectedCategory = searchParams.category || "All"

  // Fetch guides with optional category filter
  let guidesQuery = supabase.from("guides").select("*").order("created_at", { ascending: false })

  if (selectedCategory !== "All") {
    guidesQuery = guidesQuery.eq("category", selectedCategory)
  }

  const { data: guides } = await guidesQuery

  // Fetch user's saved guides if logged in
  let savedGuideIds: number[] = []
  if (session) {
    const { data: savedGuides } = await supabase.from("saved_guides").select("guide_id").eq("user_id", session.user.id)

    savedGuideIds = savedGuides?.map((item) => item.guide_id) || []
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Health Guides</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive collection of health guides to help you understand, manage, and prevent various
          health conditions.
        </p>
      </div>

      <Tabs defaultValue={selectedCategory} className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-muted/60">
            {categories.map((category) => (
              <Link key={category} href={`/guides?category=${category}`} passHref>
                <TabsTrigger value={category} className="px-4">
                  {category}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            {guides && guides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <Card key={guide.id} className="flex flex-col h-full">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={guide.image_url || "/placeholder.svg?height=200&width=400"}
                        alt={guide.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{guide.title}</CardTitle>
                          <CardDescription>{guide.category}</CardDescription>
                        </div>
                        {session && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={savedGuideIds.includes(guide.id) ? "text-primary" : ""}
                          >
                            <BookmarkIcon className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{guide.description}</p>
                      <div className="flex items-center mt-4 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded mr-2">{guide.difficulty}</span>
                        <span>{guide.time}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/guides/${guide.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Read Guide
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No guides found</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory === "All"
                    ? "There are no guides available at the moment."
                    : `There are no guides in the ${selectedCategory} category.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

