/**
 * Utility function to check if required environment variables are set
 */
export function checkRequiredEnvVars() {
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    return true
  } catch (error) {
    console.error("Invalid NEXT_PUBLIC_SUPABASE_URL format:", error)
    return false
  }
}

/**
 * Get a safe Supabase URL that's guaranteed to be in a valid format
 */
export function getSafeSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!url) {
    return "https://example.supabase.co" // Fallback URL
  }

  try {
    new URL(url)
    return url
  } catch (error) {
    console.error("Invalid Supabase URL format:", error)
    return "https://example.supabase.co" // Fallback URL
  }
}

