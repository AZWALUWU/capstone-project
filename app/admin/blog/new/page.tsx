import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import BlogEditor from "@/components/blog-editor"

export default async function NewBlogPostPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (!profile || !profile.preferences?.is_admin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Buat Artikel Blog Baru</h1>
      <BlogEditor />
    </div>
  )
}

