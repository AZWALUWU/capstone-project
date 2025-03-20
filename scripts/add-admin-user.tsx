"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { createAdminUser } from "@/app/actions/admin"

export default function AddAdminUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createAdminUser()

      if (!result.success) {
        throw new Error(result.error || "Gagal menambahkan admin")
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Error adding admin:", err)
      setError(err.message || "Gagal menambahkan admin. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Tambah Admin</CardTitle>
            <CardDescription>
              Tambahkan pengguna admin dengan email admin@example.com dan kata sandi admin123
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Admin berhasil ditambahkan! Email: admin@example.com, Kata Sandi: admin123
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddAdmin} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menambahkan Admin...
                </>
              ) : (
                "Tambah Admin"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

