import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GuideNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
        Sorry, the guide you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/guides">
        <Button>Browse All Guides</Button>
      </Link>
    </div>
  )
}

