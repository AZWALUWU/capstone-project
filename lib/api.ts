// API utility functions for connecting to the Flask backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

/**
 * Fetch blog posts with optional filtering
 */
export async function fetchBlogPosts(
  options: {
    page?: number
    perPage?: number
    category?: string
    search?: string
  } = {},
) {
  const { page = 1, perPage = 10, category, search } = options

  let url = `${API_URL}/posts?page=${page}&per_page=${perPage}`

  if (category) {
    url += `&category=${encodeURIComponent(category)}`
  }

  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch blog posts: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch a single blog post by ID
 */
export async function fetchBlogPost(id: number) {
  const response = await fetch(`${API_URL}/posts/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch blog post: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Submit a diagnosis request to the ML model
 */
export async function submitDiagnosis(data: {
  symptom: string
  severity: string
  duration: string
}) {
  // Check if we're in development mode without an API
  if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
    // Return mock data for development
    console.warn("API URL not configured. Using mock data for diagnosis.")

    // Mock diagnoses based on input
    const mockDiagnoses: Record<string, any> = {
      "fever+moderate+4_7_days": {
        condition: "Influenza",
        description: "Infeksi virus yang menyerang sistem pernapasan Anda.",
        confidence: 0.85,
        firstAid: [
          "Istirahat dan tetap terhidrasi",
          "Minum obat penurun demam yang dijual bebas",
          "Konsultasikan dengan dokter jika gejala memburuk",
        ],
      },
      default: {
        condition: "Ketidaknyamanan Umum",
        description: "Gejala Anda menunjukkan ketidaknyamanan umum.",
        confidence: 0.65,
        firstAid: [
          "Istirahat dan pantau gejala Anda",
          "Tetap terhidrasi",
          "Konsultasikan dengan profesional kesehatan jika gejala berlanjut",
        ],
      },
    }

    // Create a key to look up in our mock diagnoses
    const key = `${data.symptom}+${data.severity}+${data.duration}`

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return mockDiagnoses[key] || mockDiagnoses.default
  }

  // Real API call for production
  const response = await fetch(`${API_URL}/diagnose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to submit diagnosis: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Check the health of the API
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)

    if (!response.ok) {
      return { status: "unhealthy", message: response.statusText }
    }

    return response.json()
  } catch (error) {
    return { status: "unhealthy", message: (error as Error).message }
  }
}

/**
 * Fetch model information
 */
export async function fetchModelInfo() {
  try {
    const response = await fetch(`${API_URL}/model-info`)

    if (!response.ok) {
      return { error: "Failed to fetch model info" }
    }

    return response.json()
  } catch (error) {
    return { error: (error as Error).message }
  }
}

/**
 * Fetch feature options for the diagnosis form
 */
export async function fetchFeatureOptions() {
  try {
    const response = await fetch(`${API_URL}/feature-options`)

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching feature options:", error)
    return null
  }
}

