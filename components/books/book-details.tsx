"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, BookOpen, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string | null
  cover_url: string | null
  book_url: string
}

interface BookDetailsProps {
  book: Book
  user: { id: string; email?: string } | null
}

export function BookDetails({ book, user }: BookDetailsProps) {
  const [downloading, setDownloading] = useState(false)
  const [showReader, setShowReader] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDownload = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setDownloading(true)

    try {
      // Record the download
      await supabase.from("downloads").insert({
        user_id: user.id,
        book_id: book.id,
      })

      // Open book URL in new tab
      window.open(book.book_url, "_blank")
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setDownloading(false)
    }
  }

  const handleRead = () => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    setShowReader(true)
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <Link
          href="/books"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Books
        </Link>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={book.cover_url || "/placeholder-book.jpg"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2">
            <Badge className="mb-4">{book.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">by {book.author}</p>

            {book.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" onClick={handleRead}>
                <BookOpen className="mr-2 h-5 w-5" />
                Read Online
              </Button>
              <Button size="lg" variant="outline" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  "Opening..."
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Open Book
                  </>
                )}
              </Button>
            </div>

            {!user && (
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                      create an account
                    </Link>{" "}
                    to read and download this book.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Embedded Reader */}
        {showReader && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Reading: {book.title}</h2>
              <Button variant="outline" onClick={() => setShowReader(false)}>
                Close Reader
              </Button>
            </div>
            <Card className="overflow-hidden">
              <iframe
                src={book.book_url}
                title={book.title}
                className="w-full h-[70vh] border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
