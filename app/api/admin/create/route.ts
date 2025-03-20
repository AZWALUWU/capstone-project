import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if admin user already exists by trying to sign in
    // This is a safer approach than trying to query the auth.users table directly
    const { data: adminUser, error: signInError } = await supabase.auth.signInWithPassword({
      email: "admin@example.com",
      password: "admin123",
    })

    // If sign in succeeds, the user exists
    if (adminUser?.user) {
      // Update existing user to be admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", adminUser.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }

      // Update profile to be admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          preferences: {
            ...profile?.preferences,
            is_admin: true,
          },
        })
        .eq("id", adminUser.user.id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Admin user updated successfully" })
    } else {
      // User doesn't exist or sign in failed, create new admin user
      // We'll ignore the sign in error since we're expecting it if the user doesn't exist

      // Create new admin user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: "admin@example.com",
        password: "admin123",
        email_confirm: true,
      })

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      if (newUser?.user) {
        // Update profile to be admin
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            preferences: {
              is_admin: true,
            },
          })
          .eq("id", newUser.user.id)

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true, message: "Admin user created successfully" })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

