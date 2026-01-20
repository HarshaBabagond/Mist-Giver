import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { BookDetails } from "@/components/books/book-details"

interface BookPageProps {
  params: Promise<{ id: string }>
}

async function getBook(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .eq("enabled", true)
    .single()
  
  return data
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const [book, user] = await Promise.all([
    getBook(id),
    getCurrentUser()
  ])

  if (!book) {
    notFound()
  }

  return <BookDetails book={book} user={user} />
}
