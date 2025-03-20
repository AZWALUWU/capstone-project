"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createAdminUser() {
  try {
    const supabase = createServerActionClient({ cookies })

    // First, try to create the user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "admin123",
      email_confirm: true,
    })

    // If user already exists, we'll get an error
    if (createError && createError.message.includes("already exists")) {
      // Try to find the user by email
      const {
        data: { users },
        error: listError,
      } = await supabase.auth.admin.listUsers()

      if (listError) {
        throw new Error(`Failed to list users: ${listError.message}`)
      }

      const adminUser = users.find((user) => user.email === "admin@example.com")

      if (!adminUser) {
        throw new Error("Admin user exists but couldn't be found")
      }

      // Update the profile to be admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          preferences: {
            is_admin: true,
          },
        })
        .eq("id", adminUser.id)

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      revalidatePath("/admin")
      return { success: true, message: "Admin user updated successfully" }
    }

    // If we successfully created the user
    if (userData?.user) {
      // Update the profile to be admin
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          preferences: {
            is_admin: true,
          },
        })
        .eq("id", userData.user.id)

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      revalidatePath("/admin")
      return { success: true, message: "Admin user created successfully" }
    }

    throw new Error("Failed to create admin user")
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

