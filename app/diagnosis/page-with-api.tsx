"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserClient } from "@/lib/supabase-browser"

// Mock data for the diagnosis form - in a real app, this would come from the ML model
const symptoms = [
  { id: "fever", label: "Fever" },
  { id: "cough", label: "Cough" },
  { id: "headache", label: "Headache" },
  { id: "fatigue", label: "Fatigue" },
  { id: "nausea", label: "Nausea" },
  { id: "dizziness", label: "Dizziness" },
  { id: "sore_throat", label: "Sore Throat" },
  { id: "chest_pain", label: "Chest Pain" },
]

const durations = [
  { id: "less_than_day", label: "Less than a day" },
  { id: "1_3_days", label: "1-3 days" },
  { id: "4_7_days", label: "4-7 days" },
  { id: "more_than_week", label: "More than a week" },
]

const severities = [
  { id: "mild", label: "Mild" },
  { id: "moderate", label: "Moderate" },
  { id: "severe", label: "Severe" },
]

export default function DiagnosisPage() {
  const [symptom, setSymptom] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Mock API response for development
      // In production, this would be replaced with the actual API call:
      // const diagnosis = await submitDiagnosis({ symptom, severity, duration })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock diagnoses based on input
      const mockDiagnoses: Record<string, any> = {
        "fever+moderate+4_7_days": {
          condition: "Influenza",
          description:
            "A viral infection that attacks your respiratory system. Common symptoms include fever, body aches, and fatigue.",
          confidence: 0.85,
          firstAid: [
            "Rest and stay hydrated",
            "Take over-the-counter fever reducers",
            "Use a humidifier to ease congestion",
            "Consult a doctor if symptoms worsen",
          ],
        },
        "headache+severe+more_than_week": {
          condition: "Migraine",
          description:
            "A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.",
          confidence: 0.78,
          firstAid: [
            "Rest in a quiet, dark room",
            "Apply cold compresses to your forehead",
            "Try over-the-counter pain relievers",
            "Stay hydrated",
            "Consult a doctor for recurring migraines",
          ],
        },
        "cough+moderate+1_3_days": {
          condition: "Common Cold",
          description:
            "A viral infection of your nose and throat. It's usually harmless, although it might not feel that way.",
          confidence: 0.82,
          firstAid: [
            "Get plenty of rest",
            "Drink fluids to prevent dehydration",
            "Use over-the-counter cold medications",
            "Try honey for cough relief",
          ],
        },
        "fatigue+mild+more_than_week": {
          condition: "Chronic Fatigue",
          description: "Extreme fatigue that can't be explained by an underlying medical condition.",
          confidence: 0.65,
          firstAid: [
            "Establish a regular sleep schedule",
            "Pace yourself during activities",
            "Avoid caffeine, alcohol, and nicotine",
            "Consider speaking with a healthcare provider",
          ],
        },
      }

      // Create a key to look up in our mock diagnoses
      const key = `${symptom}+${severity}+${duration}`

      // Default diagnosis if the specific combination isn't found
      const defaultDiagnosis = {
        condition: "General Discomfort",
        description:
          "Your symptoms suggest a general discomfort that could be related to various factors including stress, minor illness, or lifestyle factors.",
        confidence: 0.65,
        firstAid: [
          "Rest and monitor your symptoms",
          "Stay hydrated",
          "Consult a healthcare professional if symptoms persist or worsen",
        ],
      }

      const diagnosis = mockDiagnoses[key] || defaultDiagnosis
      setResult(diagnosis)
    } catch (err) {
      setError("Failed to get diagnosis. Please try again later.")
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
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) {
      router.push("/login")
      return
    }

    // Save diagnosis result to Supabase
    const { error } = await supabase.from("diagnosis_history").insert({
      user_id: session.session.user.id,
      condition: result.condition,
      symptoms: getSymptomLabel(symptom),
      severity: getSeverityLabel(severity),
      duration: getDurationLabel(duration),
      confidence: result.confidence,
      recommendations: result.firstAid.join(", "),
    })

    if (error) {
      setError("Failed to save diagnosis. Please try again.")
      console.error(error)
    } else {
      setSaved(true)
    }
  }

  const getSymptomLabel = (id: string) => {
    return symptoms.find((s) => s.id === id)?.label || id
  }

  const getSeverityLabel = (id: string) => {
    return severities.find((s) => s.id === id)?.label || id
  }

  const getDurationLabel = (id: string) => {
    return durations.find((d) => d.id === id)?.label || id
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Health Diagnosis</h1>
          <p className="text-xl text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            This tool is for informational purposes only and is not a substitute for professional medical advice,
            diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Symptom Assessment</CardTitle>
              <CardDescription>
                Please provide information about your symptoms to receive a preliminary assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symptom">Primary Symptom</Label>
                  <Select value={symptom} onValueChange={setSymptom} required>
                    <SelectTrigger id="symptom">
                      <SelectValue placeholder="Select a symptom" />
                    </SelectTrigger>
                    <SelectContent>
                      {symptoms.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={severity} onValueChange={setSeverity} required>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((item) => (
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
                      Analyzing...
                    </>
                  ) : (
                    "Get Assessment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>Based on the information provided, here is your preliminary assessment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Possible Condition</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{result.condition}</p>
                <p className="mt-2">{result.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Symptom:</span> {getSymptomLabel(symptom)}
                </div>
                <div>
                  <span className="font-medium">Severity:</span> {getSeverityLabel(severity)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {getDurationLabel(duration)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">First Aid Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.firstAid.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {saved && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-600 dark:text-green-400">Saved Successfully</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Your diagnosis result has been saved to your profile.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Start Over
              </Button>
              <Button onClick={saveResult} disabled={saved}>
                {saved ? "Saved" : "Save Results"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

