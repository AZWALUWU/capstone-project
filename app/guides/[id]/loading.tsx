import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function GuideLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <Skeleton className="aspect-video w-full rounded-lg mb-8" />

          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3" />

          <Separator className="my-8" />

          <div className="space-y-8">
            <section>
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="w-full">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

