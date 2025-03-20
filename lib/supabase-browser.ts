"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Default URL to use if environment variable is missing
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"

let supabaseClient: ReturnType<typeof createClientComponentClient<Database>>

export const createBrowserClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  // Ensure we have a valid URL by providing a fallback
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL

  try {
    // Test if URL is valid
    new URL(supabaseUrl)

    supabaseClient = createClientComponentClient<Database>({
      options: {
        supabaseUrl,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    })
    return supabaseClient
  } catch (error) {
    console.error("Invalid Supabase URL:", error)
    throw new Error("Invalid Supabase URL configuration. Please check your environment variables.")
  }
}

