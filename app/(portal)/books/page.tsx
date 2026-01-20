import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { BooksGrid } from "@/components/books/books-grid"
import { BooksSearch } from "@/components/books/books-search"

interface BooksPageProps {
  searchParams: Promise<{ search?: string; category?: string }>
}

async function getBooks(search?: string, category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from("books")
    .select("*")
    .eq("enabled", true)
    .order("title")
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  if (category && category !== "all") {
    query = query.eq("category", category)
  }
  
  const { data } = await query
  return data || []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("category")
    .eq("enabled", true)
  
  const categories = data?.map(b => b.category) || []
  return [...new Set(categories)].sort()
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams
  const [books, categories] = await Promise.all([
    getBooks(params.search, params.category),
    getCategories()
  ])

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Books</h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of books across various categories
          </p>
        </div>

        <Suspense fallback={null}>
          <BooksSearch categories={categories} />
        </Suspense>

        <div className="mt-8">
          {books.length > 0 ? (
            <BooksGrid books={books} />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No books found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
