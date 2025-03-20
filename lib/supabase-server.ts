import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Default URL to use if environment variable is missing
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"

export const createServerClient = () => {
  // Ensure we have a valid URL by providing a fallback
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL

  // Validate URL format before creating client
  try {
    // Test if URL is valid
    new URL(supabaseUrl)

    return createServerComponentClient<Database>({
      cookies,
      options: {
        supabaseUrl,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    })
  } catch (error) {
    console.error("Invalid Supabase URL:", error)
    throw new Error("Invalid Supabase URL configuration. Please check your environment variables.")
  }
}

