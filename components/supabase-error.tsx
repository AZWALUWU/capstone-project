import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SupabaseError({ message = "Database connection error" }: { message?: string }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Supabase Configuration Issue</h2>
        <p className="mb-4 text-muted-foreground">
          There appears to be an issue with your Supabase configuration. Please check your environment variables and
          ensure they are correctly set.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-2">Required Environment Variables:</h3>
        <ul className="list-disc pl-5 mb-6 space-y-1 text-muted-foreground">
          <li>
            <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> - Must be a valid URL (e.g.,
            https://your-project-id.supabase.co)
          </li>
          <li>
            <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase
            anon/public key
          </li>
        </ul>

        <div className="flex justify-end">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

