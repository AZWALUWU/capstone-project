"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Blog categories
const categories = [
  "Tips Kesehatan",
  "Nutrisi",
  "Pertolongan Pertama",
  "Kesehatan Mental",
  "Kesejahteraan",
  "Perawatan Kronis",
  "Pencegahan",
]

interface BlogEditorProps {
  post?: any
  isEdit?: boolean
}

export default function BlogEditor({ post, isEdit = false }: BlogEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  useEffect(() => {
    if (post && isEdit) {
      setTitle(post.title || "")
      setContent(post.content || "")
      setExcerpt(post.excerpt || "")
      setCategory(post.category || "")
      setImageUrl(post.image_url || "")
    }
  }, [post, isEdit])

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (!profile || !profile.preferences?.is_admin) {
        setError("Anda tidak memiliki akses untuk mengedit artikel.")
        router.push("/")
      }
    } catch (err) {
      console.error("Error checking admin:", err)
      setError("Terjadi kesalahan saat memeriksa status admin.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (!profile || !profile.preferences?.is_admin) {
        throw new Error("Anda tidak memiliki akses untuk mengedit artikel.")
      }

      const postData = {
        title,
        content,
        excerpt,
        category,
        image_url: imageUrl || "/placeholder.svg?height=400&width=800",
        author_id: session.user.id,
      }

      if (isEdit && post) {
        // Update existing post
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", post.id)

        if (error) throw error
      } else {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert(postData)

        if (error) throw error
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving post:", err)
      setError(err.message || "Gagal menyimpan artikel. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (error && error.includes("tidak memiliki akses")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Artikel Blog" : "Buat Artikel Blog Baru"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Artikel Blog" : "Buat Artikel Blog Baru"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required />
            <p className="text-sm text-muted-foreground">
              Ringkasan singkat artikel yang akan muncul di daftar artikel.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} required />
            <p className="text-sm text-muted-foreground">
              Konten HTML didukung. Gunakan &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, dll. untuk pemformatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL Gambar</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/placeholder.svg?height=400&width=800"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Memperbarui..." : "Membuat..."}
              </>
            ) : isEdit ? (
              "Perbarui Artikel"
            ) : (
              "Buat Artikel"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

