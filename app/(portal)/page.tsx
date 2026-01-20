import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Download, Search, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"

async function getFeaturedBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("enabled", true)
    .limit(4)
  return data || []
}

export default async function HomePage() {
  const books = await getFeaturedBooks()

  return (
    <Suspense fallback={null}>
      <div>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
                Your Gateway to
                <span className="text-primary"> Endless Reading</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Discover, read, and download books from our curated collection. 
                Join thousands of readers who have found their next favorite book with Mist Giver.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/books">
                  <Button size="lg" className="w-full sm:w-auto">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Books
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Mist Giver?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We make reading accessible and enjoyable for everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-none bg-muted/30">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Search and filter through our extensive library to find exactly what you're looking for.
                  </p>
                </CardContent>
              </Card>
            
              <Card className="border-0 shadow-none bg-muted/30">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Instant Downloads</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Download books instantly and read offline on any device, anytime, anywhere.
                  </p>
                </CardContent>
              </Card>
            
              <Card className="border-0 shadow-none bg-muted/30">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Free</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your data is protected and our basic library access is completely free.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        {books.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Books</h2>
                  <p className="text-muted-foreground">Explore our handpicked selections</p>
                </div>
                <Link href="/books">
                  <Button variant="outline" className="bg-transparent">View All</Button>
                </Link>
              </div>
            
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={book.cover_url || "/placeholder-book.jpg"}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Reading Journey Today</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Join our community of book lovers and get unlimited access to our growing library.
                </p>
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary">
                    Sign Up for Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Suspense>
  )
}
