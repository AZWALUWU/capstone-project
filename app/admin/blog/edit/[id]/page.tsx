import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import BlogEditor from "@/components/blog-editor"

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
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

  // Fetch the blog post
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

  if (!post) {
    redirect("/admin/blog")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Artikel Blog</h1>
      <BlogEditor post={post} isEdit={true} />
    </div>
  )
}

