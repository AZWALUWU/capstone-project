"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserClient } from "@/lib/supabase-browser"
import { submitDiagnosis } from "@/lib/api"

// Default options if API fails to provide them
const defaultOptions = {
  symptom: [
    { id: "fever", label: "Demam" },
    { id: "cough", label: "Batuk" },
    { id: "headache", label: "Sakit Kepala" },
    { id: "fatigue", label: "Kelelahan" },
    { id: "nausea", label: "Mual" },
    { id: "dizziness", label: "Pusing" },
    { id: "sore_throat", label: "Sakit Tenggorokan" },
    { id: "chest_pain", label: "Nyeri Dada" },
  ],
  severity: [
    { id: "mild", label: "Ringan" },
    { id: "moderate", label: "Sedang" },
    { id: "severe", label: "Berat" },
  ],
  duration: [
    { id: "less_than_day", label: "Kurang dari sehari" },
    { id: "1_3_days", label: "1-3 hari" },
    { id: "4_7_days", label: "4-7 hari" },
    { id: "more_than_week", label: "Lebih dari seminggu" },
  ],
}

export default function DiagnosisPage() {
  const [symptom, setSymptom] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [options, setOptions] = useState(defaultOptions)
  const [loadingOptions, setLoadingOptions] = useState(true)

  const router = useRouter()
  const supabase = createBrowserClient()

  // Fetch feature options and model info when the component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/feature-options`,
        )
        if (response.ok) {
          const data = await response.json()

          // Transform the API response to match our format
          const transformedOptions: any = {}

          for (const [key, values] of Object.entries(data)) {
            transformedOptions[key] = (values as string[]).map((value) => ({
              id: value,
              label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
            }))
          }

          setOptions(transformedOptions)
        }
      } catch (err) {
        console.error("Error fetching options:", err)
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/model-info`)
        if (response.ok) {
          const data = await response.json()
          setModelInfo(data)
        }
      } catch (err) {
        console.error("Error fetching model info:", err)
      }

      setLoadingOptions(false)
    }

    fetchOptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const diagnosis = await submitDiagnosis({
        symptom,
        severity,
        duration,
      })

      setResult(diagnosis)
    } catch (err: any) {
      setError("Gagal mendapatkan diagnosis. Silakan coba lagi nanti.")
      console.error(err)
    } finally {
      setLoading(false)
      setSaved(false)
    }
  }

  const resetForm = () => {
    setSymptom("")
    setDuration("")
    setSeverity("")
    setResult(null)
    setSaved(false)
    setError(null)
  }

  const saveResult = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()

      if (!session.session) {
        router.push("/login")
        return
      }

      // Save diagnosis result to Supabase
      const { error: saveError } = await supabase.from("diagnosis_history").insert({
        user_id: session.session.user.id,
        condition: result.condition,
        symptoms: getSymptomLabel(symptom),
        severity: getSeverityLabel(severity),
        duration: getDurationLabel(duration),
        confidence: result.confidence,
        recommendations: result.firstAid.join(", "),
      })

      if (saveError) {
        throw saveError
      }

      setSaved(true)
      router.refresh()
    } catch (err) {
      setError("Gagal menyimpan diagnosis. Silakan coba lagi.")
      console.error(err)
    }
  }

  const getSymptomLabel = (id: string) => {
    return options.symptom?.find((s) => s.id === id)?.label || id
  }

  const getSeverityLabel = (id: string) => {
    return options.severity?.find((s) => s.id === id)?.label || id
  }

  const getDurationLabel = (id: string) => {
    return options.duration?.find((d) => d.id === id)?.label || id
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Diagnosis Kesehatan</h1>
          <p className="text-xl text-muted-foreground">
            Gunakan alat berbasis AI kami untuk mendapatkan penilaian awal tentang gejala Anda dan menerima rekomendasi
            pertolongan pertama.
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription>
            Alat ini hanya untuk tujuan informasi dan bukan pengganti saran medis profesional, diagnosis, atau
            pengobatan. Selalu konsultasikan dengan dokter atau penyedia layanan kesehatan lainnya.
          </AlertDescription>
        </Alert>

        {modelInfo && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Informasi Model AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Akurasi Model:</p>
                  <p className="text-lg font-bold text-primary">{modelInfo.accuracy}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fitur Terpenting:</p>
                  <p className="text-lg font-bold text-primary">{modelInfo.most_important_feature}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ⭐ Akurasi model didasarkan pada data yang digunakan untuk pelatihan dan mencerminkan seberapa baik
                model AI dapat memberikan rekomendasi yang benar untuk dataset tersebut. Akurasi model dan fitur
                terpenting dapat membantu memahami cara kerja model, tetapi tidak boleh dianggap sebagai fakta absolut
                tentang dunia nyata.
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Penilaian Gejala</CardTitle>
              <CardDescription>
                Silakan berikan informasi tentang gejala Anda untuk menerima penilaian awal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOptions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="symptom">Gejala Utama</Label>
                    <Select value={symptom} onValueChange={setSymptom} required>
                      <SelectTrigger id="symptom">
                        <SelectValue placeholder="Pilih gejala" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.symptom?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Tingkat Keparahan</Label>
                    <Select value={severity} onValueChange={setSeverity} required>
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Pilih tingkat keparahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.severity?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi</Label>
                    <Select value={duration} onValueChange={setDuration} required>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.duration?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      "Dapatkan Penilaian"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Penilaian</CardTitle>
              <CardDescription>
                Berdasarkan informasi yang diberikan, berikut adalah penilaian awal Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Kemungkinan Kondisi</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    Keyakinan: {Math.round(result.confidence * 100)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{result.condition}</p>
                <p className="mt-2">{result.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Gejala:</span> {getSymptomLabel(symptom)}
                </div>
                <div>
                  <span className="font-medium">Tingkat Keparahan:</span> {getSeverityLabel(severity)}
                </div>
                <div>
                  <span className="font-medium">Durasi:</span> {getDurationLabel(duration)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Rekomendasi Pertolongan Pertama</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.firstAid.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {saved && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-600 dark:text-green-400">Berhasil Disimpan</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Hasil diagnosis Anda telah disimpan ke profil Anda.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Mulai Ulang
              </Button>
              <Button onClick={saveResult} disabled={saved}>
                {saved ? "Tersimpan" : "Simpan Hasil"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

