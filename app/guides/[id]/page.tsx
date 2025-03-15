import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, AlertTriangle, ArrowLeft, Share2 } from "lucide-react"
import SaveGuideButton from "@/components/save-guide-button"

export default async function GuidePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch the guide
  const { data: guide } = await supabase.from("guides").select("*").eq("id", params.id).single()

  if (!guide) {
    notFound()
  }

  // Parse the JSON content
  const content = JSON.parse(guide.content)

  // Check if the guide is saved by the user
  let isSaved = false
  if (session) {
    const { data: savedGuide } = await supabase
      .from("saved_guides")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("guide_id", guide.id)
      .maybeSingle()

    isSaved = !!savedGuide
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/guides">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{guide.title}</h1>
            <div className="flex space-x-2">
              {session && <SaveGuideButton guideId={guide.id} initialSaved={isSaved} />}
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{guide.category}</span>
            <span className="bg-muted px-3 py-1 rounded-full text-sm flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {guide.time}
            </span>
            <span className="bg-muted px-3 py-1 rounded-full text-sm">{guide.difficulty}</span>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={guide.image_url || "/placeholder.svg?height=400&width=800"}
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-lg text-muted-foreground mb-8">{guide.description}</p>

          <Separator className="my-8" />

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <div className="space-y-6">
                {content.steps.map((step: any, index: number) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                        <p>{step.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Helpful Tips</h2>
              <ul className="space-y-2 list-disc pl-5">
                {content.tips.map((tip: string, index: number) => (
                  <li key={index} className="text-lg">
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            {content.warnings && content.warnings.length > 0 && (
              <>
                <Separator />

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Important Warnings</h2>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      <ul className="space-y-2 list-disc pl-5 mt-2">
                        {content.warnings.map((warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

