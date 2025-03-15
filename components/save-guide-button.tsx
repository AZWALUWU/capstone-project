"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase-browser"

interface SaveGuideButtonProps {
  guideId: number
  initialSaved: boolean
}

export default function SaveGuideButton({ guideId, initialSaved }: SaveGuideButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const toggleSave = async () => {
    setIsLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      if (isSaved) {
        // Remove from saved guides
        const { error } = await supabase
          .from("saved_guides")
          .delete()
          .eq("user_id", session.user.id)
          .eq("guide_id", guideId)

        if (error) throw error
      } else {
        // Add to saved guides
        const { error } = await supabase.from("saved_guides").insert({
          user_id: session.user.id,
          guide_id: guideId,
        })

        if (error) throw error
      }

      setIsSaved(!isSaved)
      router.refresh()
    } catch (error) {
      console.error("Error toggling save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSave}
      disabled={isLoading}
      className={isSaved ? "text-primary border-primary" : ""}
    >
      <BookmarkIcon className="h-5 w-5" />
    </Button>
  )
}

