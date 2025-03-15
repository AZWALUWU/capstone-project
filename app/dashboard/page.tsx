import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon, ClockIcon, HeartIcon, HistoryIcon } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's saved guides and diagnosis history
  const { data: savedGuides } = await supabase
    .from("saved_guides")
    .select("*, guide:guides(*)")
    .eq("user_id", session.user.id)
    .limit(5)

  const { data: diagnosisHistory } = await supabase
    .from("diagnosis_history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="saved">Saved Guides</TabsTrigger>
          <TabsTrigger value="history">Diagnosis History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Saved Guides</CardTitle>
                <CardDescription>Your bookmarked health guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{savedGuides?.length || 0}</div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard?tab=saved">
                  <Button variant="ghost" size="sm">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Diagnosis History</CardTitle>
                <CardDescription>Your previous health assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{diagnosisHistory?.length || 0}</div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard?tab=history">
                  <Button variant="ghost" size="sm">
                    <HistoryIcon className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Health Status</CardTitle>
                <CardDescription>Your current health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">Good</div>
              </CardContent>
              <CardFooter>
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm">
                    <HeartIcon className="mr-2 h-4 w-4" />
                    New Diagnosis
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Saved Guides</CardTitle>
                <CardDescription>Your recently bookmarked guides</CardDescription>
              </CardHeader>
              <CardContent>
                {savedGuides && savedGuides.length > 0 ? (
                  <ul className="space-y-4">
                    {savedGuides.map((item: any) => (
                      <li key={item.id} className="flex items-start space-x-3">
                        <BookmarkIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <Link href={`/guides/${item.guide.id}`} className="font-medium hover:underline">
                            {item.guide.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Saved on {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">You haven't saved any guides yet.</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/guides">
                  <Button variant="outline">Browse Guides</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Diagnosis History</CardTitle>
                <CardDescription>Your recent health assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {diagnosisHistory && diagnosisHistory.length > 0 ? (
                  <ul className="space-y-4">
                    {diagnosisHistory.map((item: any) => (
                      <li key={item.id} className="flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{item.condition}</div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()} at{" "}
                            {new Date(item.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">You haven't performed any diagnoses yet.</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/diagnosis">
                  <Button variant="outline">New Diagnosis</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Guides</CardTitle>
              <CardDescription>All your bookmarked health guides</CardDescription>
            </CardHeader>
            <CardContent>
              {savedGuides && savedGuides.length > 0 ? (
                <div className="space-y-6">
                  {savedGuides.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="w-full md:w-1/4 aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.guide.image_url || "/placeholder.svg?height=200&width=300"}
                          alt={item.guide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          <Link href={`/guides/${item.guide.id}`} className="hover:underline">
                            {item.guide.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{item.guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                              {item.guide.category}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Saved on {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved guides</h3>
                  <p className="text-muted-foreground mb-6">You haven't saved any guides yet.</p>
                  <Link href="/guides">
                    <Button>Browse Guides</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis History</CardTitle>
              <CardDescription>Your previous health assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {diagnosisHistory && diagnosisHistory.length > 0 ? (
                <div className="space-y-6">
                  {diagnosisHistory.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{item.condition}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()} at{" "}
                            {new Date(item.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                          Confidence: {Math.round(item.confidence * 100)}%
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm">
                            <span className="font-medium">Symptoms:</span> {item.symptoms}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Severity:</span> {item.severity}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Recommendations:</span> {item.recommendations}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No diagnosis history</h3>
                  <p className="text-muted-foreground mb-6">You haven't performed any diagnoses yet.</p>
                  <Link href="/diagnosis">
                    <Button>New Diagnosis</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="mt-1 p-2 border rounded-md bg-muted">{session.user.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <div className="mt-1 p-2 border rounded-md bg-muted">
                      {new Date(session.user.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifications" className="rounded" />
                    <label htmlFor="emailNotifications">Email Notifications</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="saveHistory" className="rounded" defaultChecked />
                    <label htmlFor="saveHistory">Save Diagnosis History</label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

