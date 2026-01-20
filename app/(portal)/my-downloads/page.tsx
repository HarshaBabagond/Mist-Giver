import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, BookOpen, ExternalLink } from "lucide-react"

async function getUserDownloads(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("downloads")
    .select(`
      id,
      downloaded_at,
      books (
        id,
        title,
        author,
        category,
        cover_url,
        book_url
      )
    `)
    .eq("user_id", userId)
    .order("downloaded_at", { ascending: false })
  
  return data || []
}

export default async function MyDownloadsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const downloads = await getUserDownloads(user.id)

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Downloads</h1>
          <p className="text-lg text-muted-foreground">
            Your reading history and downloaded books
          </p>
        </div>

        {downloads.length > 0 ? (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {downloads.map((download) => {
              const book = download.books as {
                id: string
                title: string
                author: string
                category: string
                cover_url: string | null
                book_url: string
              }
              
              if (!book) return null

              return (
                <Card key={download.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 flex-shrink-0">
                        <img
                          src={book.cover_url || "/placeholder-book.jpg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 py-4 pr-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="mb-2">
                              {book.category}
                            </Badge>
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Downloaded {new Date(download.downloaded_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/books/${book.id}`}>
                              <Button size="sm" variant="ghost">
                                <BookOpen className="h-4 w-4" />
                                <span className="sr-only">Read</span>
                              </Button>
                            </Link>
                            <a href={book.book_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open</span>
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our collection and download your first book!
              </p>
              <Link href="/books">
                <Button>Browse Books</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
