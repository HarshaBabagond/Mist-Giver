import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Download, MessageSquare } from "lucide-react"

async function getStats() {
  const supabase = await createClient()
  
  const [
    { count: booksCount },
    { count: usersCount },
    { count: downloadsCount },
    { count: messagesCount },
  ] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("downloads").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ])

  return {
    books: booksCount || 0,
    users: usersCount || 0,
    downloads: downloadsCount || 0,
    unreadMessages: messagesCount || 0,
  }
}

async function getRecentDownloads() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("downloads")
    .select(`
      id,
      downloaded_at,
      profiles!inner (full_name, email),
      books!inner (title)
    `)
    .order("downloaded_at", { ascending: false })
    .limit(5)
  
  return data || []
}

export default async function AdminDashboardPage() {
  const [stats, recentDownloads] = await Promise.all([
    getStats(),
    getRecentDownloads()
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Books
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.books}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registered Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.users}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.downloads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.unreadMessages}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDownloads.length > 0 ? (
            <div className="space-y-4">
              {recentDownloads.map((download) => {
                const profile = download.profiles as { full_name: string; email: string }
                const book = download.books as { title: string }
                
                return (
                  <div key={download.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{book?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.full_name || profile?.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(download.downloaded_at).toLocaleDateString()}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No downloads yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
