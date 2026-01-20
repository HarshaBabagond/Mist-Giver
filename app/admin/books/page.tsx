import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BooksTable } from "@/components/admin/books-table"
import { AddBookButton } from "@/components/admin/add-book-button"

async function getBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
  
  return data || []
}

export default async function AdminBooksPage() {
  const books = await getBooks()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-muted-foreground">Manage your book collection</p>
        </div>
        <AddBookButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <BooksTable books={books} />
        </CardContent>
      </Card>
    </div>
  )
}
