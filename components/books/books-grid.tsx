import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string | null
  cover_url: string | null
}

interface BooksGridProps {
  books: Book[]
}

export function BooksGrid({ books }: BooksGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link key={book.id} href={`/books/${book.id}`}>
          <Card className="group h-full overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={book.cover_url || "/placeholder-book.jpg"}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2" variant="secondary">
                {book.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
              {book.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {book.description}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
