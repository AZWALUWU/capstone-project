"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase-browser"

interface ProfileFormProps {
  profile: any
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const updates = {
        id: session.user.id,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      if (profile) {
        // Update existing profile
        const { error } = await supabase.from("profiles").update(updates).eq("id", session.user.id)

        if (error) throw error
      } else {
        // Insert new profile
        const { error } = await supabase.from("profiles").insert(updates)

        if (error) throw error
      }

      setSuccess(true)
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)

      // Reset success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(false), 3000)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input
          id="full-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar-url">Profile Picture URL</Label>
        <Input
          id="avatar-url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
        {avatarUrl && (
          <div className="mt-2 flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt="Profile preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Preview</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>

        {success && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Profile updated successfully</span>
          </div>
        )}
      </div>
    </form>
  )
}

